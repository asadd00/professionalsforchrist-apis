import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt.authguard';
import { AdminAuthGuard } from '../auth/admin.authguard';
import { ReportsService } from './reports.service';
import { ExportUsersQueryDto } from './dto/export-users-query.dto';

@Controller('reports')
@UseGuards(JwtAuthGuard, AdminAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  // Returns a raw .xlsx buffer, not the standard { success, data } envelope —
  // @Res({ passthrough: false }) opts this one route out of ResponseInterceptor.
  @Get('users/export')
  async exportUsers(@Query() query: ExportUsersQueryDto, @Res({ passthrough: false }) res: Response) {
    const buffer = await this.reportsService.exportUsersToExcel(query);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="users-export.xlsx"',
    });
    res.send(buffer);
  }
}
