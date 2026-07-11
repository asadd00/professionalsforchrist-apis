import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateEducationFundDto } from './dto/update-education-fund.dto';

const SINGLETON_ID = 1;

@Injectable()
export class EducationFundService {
  constructor(private prisma: PrismaService) {}

  get() {
    return this.prisma.educationFund.upsert({
      where: { id: SINGLETON_ID },
      update: {},
      create: { id: SINGLETON_ID, totalFund: 0, fundUtilized: 0 },
    });
  }

  update(data: UpdateEducationFundDto) {
    return this.prisma.educationFund.upsert({
      where: { id: SINGLETON_ID },
      update: data,
      create: {
        id: SINGLETON_ID,
        totalFund: data.totalFund ?? 0,
        fundUtilized: data.fundUtilized ?? 0,
      },
    });
  }
}
