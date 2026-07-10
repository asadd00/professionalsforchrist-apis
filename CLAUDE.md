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

Required env vars (see `.env`, not committed): `DATABASE_URL`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `PORT`, `DEBUG_PORT`, `ENV`, `TZ`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (used only by `prisma/seed.ts` to bootstrap the one admin/password account — see Auth below).

## Architecture

**Feature modules** live under `src/<feature>/` (`auth`, `users`, `professionals`, `businesses`, `search`, `meta`), each with its own `*.module.ts`, `*.controller.ts`, `*.service.ts`, and a `dto/` folder for `class-validator`-decorated DTOs. `AppModule` (`src/app.module.ts`) just wires these feature modules together.

**Data layer**: `src/prisma/prisma.service.ts` wraps `PrismaClient` as an injectable service; `prisma/schema.prisma` defines the models. Core domain models are `User`, `Professional`, and `Business`, each owned by a `User` (`createdById`), plus lookup tables `Education` and `Industry`. `Professional`/`Business` both use a shared `RegisterFor` enum (`self` | `someoneElse`) to distinguish whether the record is for the submitting user or filed on behalf of someone else — services generally enforce "one `self` record per user" (see `ProfessionalsController.create`).

**Auth**: custom JWT auth, not Passport, with two login paths that both issue the same token shape (`jsonwebtoken`, signed with `ACCESS_TOKEN_SECRET`, payload `{ userId, email, role }`, 1d expiry):
- `POST /auth/social` (`AuthService.socialLogin`) — used by the mobile app after Firebase Google Sign-In; upserts a `User` keyed on `[email, loginType]`.
- `POST /auth/login` (`AuthService.login`) — email/password login for the admin app (no Google involved). Looks up `User` by `[email, loginType: 'email']` and compares the password with `bcrypt`. The only account with `loginType: 'email'` is the one bootstrapped by `prisma/seed.ts` from `ADMIN_EMAIL`/`ADMIN_PASSWORD` — there's no self-serve email/password registration.

`UsersService` hashes `password` with `bcrypt` (10 salt rounds) whenever it's set on create, and strips `password` from every returned user object (see the `withoutPassword` helper) — never add a query path that returns the raw Prisma `User` row.

`JwtAuthGuard` reads the `Authorization: Bearer <token>` header, verifies it, and attaches the decoded payload to `request.user`. `AdminAuthGuard` is a second guard checked after `JwtAuthGuard` and requires `user.role === 'admin'`. Guards are applied per-controller with `@UseGuards(...)`, and stacked at the method level for admin-only routes — e.g. `POST /users`, `GET /users`, `PATCH /users/:id`, `DELETE /users/:id`, and the admin-edit routes on professionals/businesses (`PATCH /professionals/:id`, `PATCH /businesses/:id`) all require both guards. Use the `@User()` param decorator (`src/common/decorators/user.decorator.ts`) to pull the whole user payload or a single field (e.g. `@User('userId')`) out of the request.

**Response/error shape**: `ResponseInterceptor` (global) wraps every successful response as `{ success: true, statusCode, message, data }`; the `message` defaults to `'Request successful'` unless overridden with the `@ResponseMessage('...')` decorator on a handler or controller. `AllExceptionsFilter` (global) normalizes all thrown errors — including known Prisma error codes like `P2025` (not found) and `P2002` (unique constraint) — into `{ success: false, statusCode, errorCode, path, timestamp, message, stacktrace }`; `stacktrace` is only populated when `ENV=dev`.

**Pagination**: shared helper in `src/common/pagination/paginate.ts` — pass a Prisma model delegate plus `{ where, page, limit, include, orderBy }`, it caps `limit` at 100 and returns `{ list, meta }`. `PaginationQueryDto` provides the standard `page`/`limit` query params with validation/coercion.

**Search**: `SearchService` fans a query out to `ProfessionalService.findAll` and `BusinessesService.findAll` in parallel and returns both result sets keyed by `professionals` / `businesses`. Both services' admin `findAll` only add the `OR` text-search clause when `q` is a non-empty string (`...(filters.q && { OR: [...] })`) — spreading `{ contains: undefined }` into every branch of an unconditional `OR` array previously caused Prisma to match zero rows instead of "no filter", silently breaking the default browse-all-records view (no `q` param) for both admin panel and mobile "browse without searching" flows. If you touch these `findAll` methods, keep the query builder conditional on `q` being present rather than always spreading it in.

**Validation**: global `ValidationPipe({ whitelist: true })` strips unknown properties from incoming request bodies — DTOs must declare every accepted field explicitly.

**CORS**: allowed origins are hardcoded in `src/main.ts` (`bootstrap`) — update that list when adding new frontend/admin origins.
