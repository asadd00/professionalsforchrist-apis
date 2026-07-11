import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { PrismaService } from '../prisma/prisma.service';
import { ExportUsersQueryDto } from './dto/export-users-query.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async exportUsersToExcel(query: ExportUsersQueryDto): Promise<Buffer> {
    const { from, to } = query;

    const createdAt: { gte?: Date; lte?: Date } = {};
    if (from) createdAt.gte = new Date(from);
    if (to) {
      const endOfDay = new Date(to);
      endOfDay.setHours(23, 59, 59, 999);
      createdAt.lte = endOfDay;
    }

    const users = await this.prisma.user.findMany({
      where: {
        ...(from || to ? { createdAt } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        loginType: true,
        appPlatform: true,
        appVersion: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Users');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Name', key: 'name', width: 24 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Phone', key: 'phone', width: 16 },
      { header: 'Role', key: 'role', width: 10 },
      { header: 'Active', key: 'isActive', width: 10 },
      { header: 'Login Type', key: 'loginType', width: 12 },
      { header: 'Platform', key: 'appPlatform', width: 12 },
      { header: 'App Version', key: 'appVersion', width: 12 },
      { header: 'Registered At', key: 'createdAt', width: 22 },
    ];

    for (const user of users) {
      sheet.addRow(user);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
