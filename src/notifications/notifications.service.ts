import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { initializeApp, cert, App } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { getStorage } from 'firebase-admin/storage';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/pagination/paginate';
import { PaginationQueryDto } from '../common/pagination/pagination-query.dto';

export type NotificationPayload = {
  title: string;
  body: string;
  imageUrl?: string;
  data?: Record<string, string>;
};

const FCM_MULTICAST_BATCH_SIZE = 500;

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private app: App | null = null;

  constructor(private prisma: PrismaService) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn(
        'Firebase Admin credentials are not set (FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY) — push notifications will be no-ops.',
      );
      return;
    }

    if (!storageBucket) {
      this.logger.warn(
        'FIREBASE_STORAGE_BUCKET is not set — broadcast notification image uploads will fail until it is configured.',
      );
    }

    this.app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
      storageBucket,
    });
  }

  async registerDeviceToken(userId: number, token: string, platform?: string) {
    return this.prisma.deviceToken.upsert({
      where: { token },
      update: { userId, platform },
      create: { userId, token, platform },
    });
  }

  async unregisterDeviceToken(token: string) {
    return this.prisma.deviceToken.deleteMany({ where: { token } });
  }

  /**
   * Uploads a broadcast notification's image to Firebase Storage (same Firebase project as FCM)
   * and returns a public HTTPS URL. This has to be publicly reachable over the internet — FCM
   * and the receiving device fetch it directly when delivering a rich/"big picture" push, not
   * just the admin's own browser — which local disk storage behind the backend's own host can't
   * guarantee (see backend CLAUDE.md's "Notification images" for why this replaced that).
   */
  async uploadImage(buffer: Buffer, mimetype: string, extension: string): Promise<string> {
    if (!this.app) {
      throw new InternalServerErrorException(
        'Image upload is unavailable — Firebase Admin credentials are not configured.',
      );
    }

    const bucket = getStorage(this.app).bucket();
    const path = `notifications/${randomUUID()}${extension}`;

    try {
      await bucket.file(path).save(buffer, { metadata: { contentType: mimetype }, public: true });
    } catch (error) {
      // Per-object ACLs (the `public: true` option) fail on buckets with "Uniform bucket-level
      // access" enabled (the default for buckets created since 2020) — those need a bucket-level
      // IAM binding (allUsers: Storage Object Viewer) instead, set once in the Cloud Console.
      this.logger.error('Failed to upload notification image to Firebase Storage', error as Error);
      throw new InternalServerErrorException('Failed to upload image. Check the storage bucket configuration.');
    }

    return `https://storage.googleapis.com/${bucket.name}/${path}`;
  }

  async sendToUser(userId: number, payload: NotificationPayload) {
    await this.prisma.notification.create({
      data: { title: payload.title, body: payload.body, imageUrl: payload.imageUrl, userId },
    });

    const tokens = await this.prisma.deviceToken.findMany({
      where: { userId },
      select: { token: true },
    });

    return this.sendToTokens(tokens.map((t) => t.token), payload);
  }

  async sendToAll(payload: NotificationPayload) {
    await this.prisma.notification.create({
      data: { title: payload.title, body: payload.body, imageUrl: payload.imageUrl, userId: null },
    });

    const tokens = await this.prisma.deviceToken.findMany({ select: { token: true } });
    return this.sendToTokens(tokens.map((t) => t.token), payload);
  }

  /**
   * Notification history — persisted independently of FCM delivery (which is
   * best-effort and no-ops without real Firebase credentials), so the mobile
   * Notifications tab has a real, per-user, cross-device history rather than
   * relying on what a single device happened to receive/tap.
   */
  async getMyNotifications(userId: number, query: PaginationQueryDto) {
    const { page, limit } = query;

    const result = await paginate(this.prisma.notification, {
      where: {
        OR: [{ userId: null }, { userId }],
      },
      include: {
        reads: { where: { userId } },
      },
      page,
      limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      ...result,
      list: result.list.map((n: any) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        imageUrl: n.imageUrl,
        createdAt: n.createdAt,
        isRead: n.reads.length > 0,
      })),
    };
  }

  async markAllAsRead(userId: number) {
    const unread = await this.prisma.notification.findMany({
      where: {
        OR: [{ userId: null }, { userId }],
        reads: { none: { userId } },
      },
      select: { id: true },
    });

    if (unread.length === 0) return { count: 0 };

    const result = await this.prisma.notificationRead.createMany({
      data: unread.map((n) => ({ notificationId: n.id, userId })),
      skipDuplicates: true,
    });

    return result;
  }

  private async sendToTokens(tokens: string[], payload: NotificationPayload) {
    if (!this.app || tokens.length === 0) return;

    const messaging = getMessaging(this.app);

    for (let i = 0; i < tokens.length; i += FCM_MULTICAST_BATCH_SIZE) {
      const batch = tokens.slice(i, i + FCM_MULTICAST_BATCH_SIZE);

      const response = await messaging.sendEachForMulticast({
        tokens: batch,
        notification: { title: payload.title, body: payload.body, imageUrl: payload.imageUrl },
        data: payload.data,
      });

      const staleTokens = response.responses
        .map((result, index) => ({ result, token: batch[index] }))
        .filter(
          ({ result }) =>
            !result.success && result.error?.code === 'messaging/registration-token-not-registered',
        )
        .map(({ token }) => token);

      if (staleTokens.length > 0) {
        await this.prisma.deviceToken.deleteMany({ where: { token: { in: staleTokens } } });
      }
    }
  }
}
