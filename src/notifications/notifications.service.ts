import { Injectable, Logger } from '@nestjs/common';
import { initializeApp, cert, App } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/pagination/paginate';
import { PaginationQueryDto } from '../common/pagination/pagination-query.dto';

export type NotificationPayload = {
  title: string;
  body: string;
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

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn(
        'Firebase Admin credentials are not set (FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY) — push notifications will be no-ops.',
      );
      return;
    }

    this.app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
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

  async sendToUser(userId: number, payload: NotificationPayload) {
    await this.prisma.notification.create({
      data: { title: payload.title, body: payload.body, userId },
    });

    const tokens = await this.prisma.deviceToken.findMany({
      where: { userId },
      select: { token: true },
    });

    return this.sendToTokens(tokens.map((t) => t.token), payload);
  }

  async sendToAll(payload: NotificationPayload) {
    await this.prisma.notification.create({
      data: { title: payload.title, body: payload.body, userId: null },
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
        notification: { title: payload.title, body: payload.body },
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
