import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../auth/admin.authguard';
import { JwtAuthGuard } from '../auth/jwt.authguard';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { EducationFundService } from './education-fund.service';
import { UpdateEducationFundDto } from './dto/update-education-fund.dto';
import { SendEducationFundNotificationDto } from './dto/send-education-fund-notification.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Controller('education-fund')
@UseGuards(JwtAuthGuard, AdminAuthGuard)
export class EducationFundController {
  constructor(
    private educationFundService: EducationFundService,
    private notificationsService: NotificationsService,
  ) {}

  @Get()
  get() {
    return this.educationFundService.get();
  }

  @Patch()
  @ResponseMessage('Education fund updated')
  update(@Body() dto: UpdateEducationFundDto) {
    return this.educationFundService.update(dto);
  }

  @Post('notify')
  @ResponseMessage('Notification sent')
  notify(@Body() dto: SendEducationFundNotificationDto) {
    return this.notificationsService.sendToAll({
      title: 'Education Fund Update',
      body: dto.message,
    });
  }
}
