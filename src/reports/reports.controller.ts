import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt.authguard';
import { AdminAuthGuard } from '../auth/admin.authguard';
import { ReportsService } from './reports.service';
import { ExportUsersQueryDto } from './dto/export-users-query.dto';
import { ExportProfessionalsQueryDto } from './dto/export-professionals-query.dto';
import { ExportBusinessesQueryDto } from './dto/export-businesses-query.dto';

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

  @Get('professionals/export')
  async exportProfessionals(@Query() query: ExportProfessionalsQueryDto, @Res({ passthrough: false }) res: Response) {
    const buffer = await this.reportsService.exportProfessionalsToExcel(query);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="professionals-export.xlsx"',
    });
    res.send(buffer);
  }

  @Get('businesses/export')
  async exportBusinesses(@Query() query: ExportBusinessesQueryDto, @Res({ passthrough: false }) res: Response) {
    const buffer = await this.reportsService.exportBusinessesToExcel(query);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="businesses-export.xlsx"',
    });
    res.send(buffer);
  }

  // Regular JSON-envelope routes (unlike the /export routes above) — back the admin Reports
  // page's filter dropdowns with the real distinct values already in each table.
  @Get('professionals/filter-options')
  getProfessionalFilterOptions() {
    return this.reportsService.getProfessionalFilterOptions();
  }

  @Get('businesses/filter-options')
  getBusinessFilterOptions() {
    return this.reportsService.getBusinessFilterOptions();
  }
}
