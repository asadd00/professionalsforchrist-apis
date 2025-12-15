import { PrismaService } from "src/prisma/prisma.service";
import { CreateProfessionalDto } from "./dto/create-professional.dto";
import { Injectable } from "@nestjs/common";
import { UpdateProfessionalDto } from "./dto/update-professional.dto";
import { SearchQueryDto } from "src/search/dto/search-query.dto";
import { contains } from "class-validator";
import { paginate } from "src/common/pagination/paginate";

@Injectable()
export class ProfessionalService {
    constructor(private prisma: PrismaService) { }

    create(data: CreateProfessionalDto) {
        return this.prisma.professional.create({
            data
        });
    }

    findAllByUserId(userId: number) {
        return this.prisma.professional.findMany({
            where: {
                createdById: userId
            }
        });
    }

    update(id: number, userId: number, data: UpdateProfessionalDto) {
        return this.prisma.professional.update({
            where: {
                id,
                createdById: userId
            },
            data
        });
    }

    delete(id: number, userId: number) {
        return this.prisma.professional.delete({
            where: {
                id,
                createdById: userId
            }
        });
    }

    /**
     * admin
     */

    findAll(query: SearchQueryDto) {
        return paginate(this.prisma.professional, {
            where: {
                deletedAt: null,
            },
            page: query.page,
            limit: query.limit,
            orderBy: { createdAt: 'desc' },
        });
    }
}