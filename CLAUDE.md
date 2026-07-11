# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

NestJS backend API for Professionals for Christ, using Prisma ORM against PostgreSQL. All routes are served under the global prefix `api/v1`.

## Commands

```bash
# install
npm install

# run
npm run start          # normal
npm run start:dev      # watch mode
npm run start:debug     # watch mode + debugger on 0.0.0.0:9300
npm run start:prod      # run compiled dist/src/main

# build / lint / format
npm run build
npm run lint             # eslint --fix
npm run format            # prettier on src/ and test/

# tests
npm run test              # unit tests (jest)
npm run test:watch
npm run test:cov
npm run test:e2e          # e2e tests, config at test/jest-e2e.json
npx jest src/path/to/file.spec.ts       # run a single unit test file
npx jest -t "test name"                  # run tests matching a name

# database (Prisma)
npx prisma migrate dev     # create/apply a migration in development
npx prisma generate        # regenerate the Prisma client
npm run seed                # seed the database (prisma/seed.ts)
npm run seed:reset          # reset db + reapply migrations (destructive)
```

Docker: `docker-compose.yml` (prod) and `docker-compose.dev.yml` (dev) are available; `Dockerfile` / `Dockerfile.dev` build the images.

Required env vars (see `.env`, not committed): `DATABASE_URL`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `PORT`, `DEBUG_PORT`, `ENV`, `TZ`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (used only by `prisma/seed.ts` to bootstrap the one admin/password account — see Auth below), `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (Firebase Admin SDK credentials for push notifications — see Notifications below; safe to leave blank in local dev, sending just no-ops with a warning log).

## Architecture

**Feature modules** live under `src/<feature>/` (`auth`, `users`, `professionals`, `businesses`, `search`, `meta`, `notifications`, `notable-businesses`, `community-leaders`, `prayer-requests`, `education-fund`, `reports`), each with its own `*.module.ts`, `*.controller.ts`, `*.service.ts`, and a `dto/` folder for `class-validator`-decorated DTOs. `AppModule` (`src/app.module.ts`) just wires these feature modules together.

**Data layer**: `src/prisma/prisma.service.ts` wraps `PrismaClient` as an injectable service; `prisma/schema.prisma` defines the models. Core domain models are `User`, `Professional`, and `Business`, each owned by a `User` (`createdById`), plus lookup tables `Education`, `Industry`, and `PrayerType`. `Professional`/`Business` both use a shared `RegisterFor` enum (`self` | `someoneElse`) to distinguish whether the record is for the submitting user or filed on behalf of someone else — services generally enforce "one `self` record per user" (see `ProfessionalsController.create`). Beyond those, `NotableBusiness` and `CommunityLeader` are purely admin-curated directories (no `createdById`/ownership, no self-serve mobile submission — mobile only reads them via `GET`), `PrayerRequest` is mobile-submitted and admin-actioned (see Notifications below), `DeviceToken` stores FCM tokens (many-to-one to `User`, since a user can have multiple devices), and `EducationFund` is a true singleton (the service always operates on `id: 1` via `upsert`, enforced only by convention — never add a raw create route for it).

**Admin-create for Professional/Business**: `POST /professionals/admin` / `POST /businesses/admin` (`AdminAuthGuard`) let an admin create a record on behalf of an arbitrary user via an optional `createdById` in the body (defaults to the admin's own id if omitted). These are separate routes from the existing self-serve `POST /professionals`/`POST /businesses`, which is intentionally untouched — it always overwrites `createdById` from the JWT and enforces the "one self record" check, and mobile behavior must not change.

**User self-profile fields**: `User` has `phone`/`city`/`residentialArea` (all optional) alongside `name`/`email`. `PATCH /users` (`UsersController.updateMe`, `JwtAuthGuard` only) accepts all four via `UpdateUserDto` — this backs the mobile app's Edit Profile screen. `email` is deliberately not editable through this DTO since it's part of the `[email, loginType]` uniqueness key auth logs in with; don't add it without also deciding how that affects existing sessions/lookups. The same `UpdateUserDto` also backs the admin-only `PATCH /users/:id` route, but the admin UI only ever sends `name` today (see admin CLAUDE.md) — the other fields are there for mobile's self-service use.

**Auth**: custom JWT auth, not Passport, with two login paths that both issue the same token shape (`jsonwebtoken`, signed with `ACCESS_TOKEN_SECRET`, payload `{ userId, email, role }`, 1d expiry):
- `POST /auth/social` (`AuthService.socialLogin`) — used by the mobile app after Firebase Google Sign-In; upserts a `User` keyed on `[email, loginType]`.
- `POST /auth/login` (`AuthService.login`) — email/password login for the admin app (no Google involved). Looks up `User` by `[email, loginType: 'email']` and compares the password with `bcrypt`. The only account with `loginType: 'email'` is the one bootstrapped by `prisma/seed.ts` from `ADMIN_EMAIL`/`ADMIN_PASSWORD` — there's no self-serve email/password registration.

`UsersService` hashes `password` with `bcrypt` (10 salt rounds) whenever it's set on create, and strips `password` from every returned user object (see the `withoutPassword` helper) — never add a query path that returns the raw Prisma `User` row.

`JwtAuthGuard` reads the `Authorization: Bearer <token>` header, verifies it, and attaches the decoded payload to `request.user`. `AdminAuthGuard` is a second guard checked after `JwtAuthGuard` and requires `user.role === 'admin'`. Guards are applied per-controller with `@UseGuards(...)`, and stacked at the method level for admin-only routes — e.g. `POST /users`, `GET /users`, `PATCH /users/:id`, `DELETE /users/:id`, and the admin-edit routes on professionals/businesses (`PATCH /professionals/:id`, `PATCH /businesses/:id`) all require both guards. Use the `@User()` param decorator (`src/common/decorators/user.decorator.ts`) to pull the whole user payload or a single field (e.g. `@User('userId')`) out of the request.

**Response/error shape**: `ResponseInterceptor` (global) wraps every successful response as `{ success: true, statusCode, message, data }`; the `message` defaults to `'Request successful'` unless overridden with the `@ResponseMessage('...')` decorator on a handler or controller. `AllExceptionsFilter` (global) normalizes all thrown errors — including known Prisma error codes like `P2025` (not found) and `P2002` (unique constraint) — into `{ success: false, statusCode, errorCode, path, timestamp, message, stacktrace }`; `stacktrace` is only populated when `ENV=dev`.

**Pagination**: shared helper in `src/common/pagination/paginate.ts` — pass a Prisma model delegate plus `{ where, page, limit, include, orderBy }`, it caps `limit` at 100 and returns `{ list, meta }`. `PaginationQueryDto` provides the standard `page`/`limit` query params with validation/coercion.

**Search**: `SearchService` fans a query out to `ProfessionalService.findAll` and `BusinessesService.findAll` in parallel and returns both result sets keyed by `professionals` / `businesses`. Both services' admin `findAll` only add the `OR` text-search clause when `q` is a non-empty string (`...(filters.q && { OR: [...] })`) — spreading `{ contains: undefined }` into every branch of an unconditional `OR` array previously caused Prisma to match zero rows instead of "no filter", silently breaking the default browse-all-records view (no `q` param) for both admin panel and mobile "browse without searching" flows. If you touch these `findAll` methods, keep the query builder conditional on `q` being present rather than always spreading it in.

**Validation**: global `ValidationPipe({ whitelist: true })` strips unknown properties from incoming request bodies — DTOs must declare every accepted field explicitly. Watch for the empty-string gotcha: `@IsOptional()` only skips validation for `undefined`/`null`, not `""` — an empty string from a blank HTML form field still hits `@IsDateString()`/etc. and fails. Add a `@Transform(({ value }) => value === '' ? undefined : value)` ahead of the validator for any optional query param a form might submit blank (see `ExportUsersQueryDto`).

**CORS**: allowed origins are hardcoded in `src/main.ts` (`bootstrap`) — update that list when adding new frontend/admin origins.

**Notifications** (`src/notifications/`): `NotificationsService` wraps the Firebase Admin SDK (`firebase-admin`, modular API — `initializeApp`/`cert` from `firebase-admin/app`, `getMessaging` from `firebase-admin/messaging`, not the older `admin.*` namespace style) behind `registerDeviceToken`/`unregisterDeviceToken`/`sendToUser`/`sendToAll`. Init is guarded: if `FIREBASE_PROJECT_ID`/`FIREBASE_CLIENT_EMAIL`/`FIREBASE_PRIVATE_KEY` are unset, it logs a warning and every send silently no-ops rather than throwing — safe for local dev without real credentials. `sendToAll` batches `DeviceToken` reads/sends in groups of 500 (FCM's `sendEachForMulticast` limit) and prunes any token FCM reports as `messaging/registration-token-not-registered`. Three things trigger a push: `POST /notifications/broadcast` (admin-composed, free-form — motivational quotes/verses/announcements), `POST /education-fund/notify` (Education Fund contribution announcements), and `PATCH /prayer-requests/:id/prayed` (built into `PrayerRequestsController.markPrayed` — `sendToUser` if the request `isAnonymous`, else `sendToAll`).

**Notification history**: `sendToUser`/`sendToAll` persist a `Notification` row (`userId` set for a targeted send, `null` for a broadcast visible to everyone) independently of whether FCM delivery actually succeeds — history exists even with no Firebase credentials configured, since persistence and push delivery are decoupled on purpose. Per-user read state is tracked via a separate `NotificationRead` join table (`@@unique([notificationId, userId])`) rather than a boolean column on `Notification`, because a single broadcast row is shared by every user and each of them needs independent read state. `GET /notifications/me` (`JwtAuthGuard`) returns the current user's visible notifications (`OR: [{userId: null}, {userId: me}]`) paginated, each with a computed `isRead` (derived from whether a matching `NotificationRead` exists — not a stored column). `PATCH /notifications/me/read-all` inserts `NotificationRead` rows for every currently-unread notification visible to the caller (`skipDuplicates: true`, safe to call repeatedly). This is what the mobile Notifications tab reads — don't reintroduce a client-side-only notification cache; it was deliberately removed in favor of this so history survives reinstalls/device switches.

**Reports** (`src/reports/`): `GET /reports/users/export?from&to` streams a `.xlsx` (via `exceljs`) instead of the usual JSON envelope — this is the one route that bypasses `ResponseInterceptor`, using `@Res({ passthrough: false })` and writing the buffer directly with `Content-Type`/`Content-Disposition` headers. Don't change how `ResponseInterceptor` behaves globally to accommodate this; keep the opt-out scoped to routes that explicitly need it.
