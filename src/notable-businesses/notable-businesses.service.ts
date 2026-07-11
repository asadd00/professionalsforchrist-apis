import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/pagination/paginate';
import { CreateNotableBusinessDto } from './dto/create-notable-business.dto';
import { UpdateNotableBusinessDto } from './dto/update-notable-business.dto';
import { NotableBusinessQueryDto } from './dto/notable-business-query.dto';

@Injectable()
export class NotableBusinessesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateNotableBusinessDto) {
    return this.prisma.notableBusiness.create({ data });
  }

  findAll(query: NotableBusinessQueryDto) {
    const { page, limit, industryId, ...filters } = query;

    return paginate(this.prisma.notableBusiness, {
      where: {
        deletedAt: null,
        ...(industryId && { industryId }),
        ...(filters.q && {
          OR: [
            { name: { contains: filters.q, mode: 'insensitive' } },
            {
              industry: {
                is: { name: { contains: filters.q, mode: 'insensitive' } },
              },
            },
          ],
        }),
      },
      include: { industry: true },
      page,
      limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.notableBusiness.findUnique({
      where: { id },
      include: { industry: true },
    });
  }

  update(id: number, data: UpdateNotableBusinessDto) {
    return this.prisma.notableBusiness.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.notableBusiness.delete({ where: { id } });
  }
}
