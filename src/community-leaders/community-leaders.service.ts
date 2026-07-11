import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/pagination/paginate';
import { CreateCommunityLeaderDto } from './dto/create-community-leader.dto';
import { UpdateCommunityLeaderDto } from './dto/update-community-leader.dto';
import { CommunityLeaderQueryDto } from './dto/community-leader-query.dto';

@Injectable()
export class CommunityLeadersService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCommunityLeaderDto) {
    return this.prisma.communityLeader.create({ data });
  }

  findAll(query: CommunityLeaderQueryDto) {
    const { page, limit, industryId, ...filters } = query;

    return paginate(this.prisma.communityLeader, {
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
    return this.prisma.communityLeader.findUnique({
      where: { id },
      include: { industry: true },
    });
  }

  update(id: number, data: UpdateCommunityLeaderDto) {
    return this.prisma.communityLeader.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.communityLeader.delete({ where: { id } });
  }
}
