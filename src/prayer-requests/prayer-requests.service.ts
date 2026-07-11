import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/pagination/paginate';
import { CreatePrayerRequestDto } from './dto/create-prayer-request.dto';
import { PaginationQueryDto } from '../common/pagination/pagination-query.dto';

@Injectable()
export class PrayerRequestsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreatePrayerRequestDto & { createdById: number }) {
    return this.prisma.prayerRequest.create({ data });
  }

  findAll(query: PaginationQueryDto) {
    const { page, limit } = query;

    return paginate(this.prisma.prayerRequest, {
      where: { deletedAt: null },
      include: { prayerType: true },
      page,
      limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  markPrayed(id: number) {
    return this.prisma.prayerRequest.update({
      where: { id },
      data: { isPrayed: true, prayedAt: new Date() },
    });
  }
}
