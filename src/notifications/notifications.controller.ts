import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.authguard';
import { AdminAuthGuard } from '../auth/admin.authguard';
import { User } from '../common/decorators/user.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { PaginationQueryDto } from '../common/pagination/pagination-query.dto';
import { NotificationsService } from './notifications.service';
import { RegisterDeviceTokenDto } from './dto/register-device-token.dto';
import { UnregisterDeviceTokenDto } from './dto/unregister-device-token.dto';
import { SendBroadcastDto } from './dto/send-broadcast.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('device-token')
  @ResponseMessage('Device registered')
  registerDeviceToken(@User('userId') userId: number, @Body() dto: RegisterDeviceTokenDto) {
    return this.notificationsService.registerDeviceToken(userId, dto.token, dto.platform);
  }

  @Delete('device-token')
  @ResponseMessage('Device unregistered')
  unregisterDeviceToken(@Body() dto: UnregisterDeviceTokenDto) {
    return this.notificationsService.unregisterDeviceToken(dto.token);
  }

  @Post('broadcast')
  @UseGuards(AdminAuthGuard)
  @ResponseMessage('Notification sent')
  sendBroadcast(@Body() dto: SendBroadcastDto) {
    return this.notificationsService.sendToAll({ title: dto.title, body: dto.body });
  }

  @Get('me')
  getMyNotifications(@User('userId') userId: number, @Query() query: PaginationQueryDto) {
    return this.notificationsService.getMyNotifications(userId, query);
  }

  @Patch('me/read-all')
  @ResponseMessage('Notifications marked as read')
  markAllAsRead(@User('userId') userId: number) {
    return this.notificationsService.markAllAsRead(userId);
  }
}
