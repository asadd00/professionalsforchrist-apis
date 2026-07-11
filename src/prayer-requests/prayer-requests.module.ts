import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrayerRequestsController } from './prayer-requests.controller';
import { PrayerRequestsService } from './prayer-requests.service';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [PrayerRequestsController],
  providers: [PrayerRequestsService],
  exports: [PrayerRequestsService],
})
export class PrayerRequestsModule {}
