import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.authguard';
import { AdminAuthGuard } from '../auth/admin.authguard';
import { User } from '../common/decorators/user.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { PaginationQueryDto } from '../common/pagination/pagination-query.dto';
import { PrayerRequestsService } from './prayer-requests.service';
import { CreatePrayerRequestDto } from './dto/create-prayer-request.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Controller('prayer-requests')
@UseGuards(JwtAuthGuard)
export class PrayerRequestsController {
  constructor(
    private prayerRequestsService: PrayerRequestsService,
    private notificationsService: NotificationsService,
  ) {}

  @Post()
  @HttpCode(201)
  @ResponseMessage('Prayer request submitted')
  create(@User('userId') userId: number, @Body() dto: CreatePrayerRequestDto) {
    return this.prayerRequestsService.create({ ...dto, createdById: userId });
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  findAll(@Query() query: PaginationQueryDto) {
    return this.prayerRequestsService.findAll(query);
  }

  @Patch(':id/prayed')
  @UseGuards(AdminAuthGuard)
  @ResponseMessage('Prayer request marked as prayed')
  async markPrayed(@Param('id', ParseIntPipe) id: number) {
    const updated = await this.prayerRequestsService.markPrayed(id);

    await this.notificationsService.sendToUser(updated.createdById, {
      title: 'Your prayer request has been prayed for',
      body: 'An admin has prayed for the request you submitted.',
    });

    return updated;
  }
}
