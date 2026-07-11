import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { EducationFundController } from './education-fund.controller';
import { EducationFundService } from './education-fund.service';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [EducationFundController],
  providers: [EducationFundService],
  exports: [EducationFundService],
})
export class EducationFundModule {}
