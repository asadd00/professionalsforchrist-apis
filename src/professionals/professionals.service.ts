import { PrismaService } from "../prisma/prisma.service";
import { CreateProfessionalDto } from "./dto/create-professional.dto";
import { Injectable } from "@nestjs/common";
import { UpdateProfessionalDto } from "./dto/update-professional.dto";
import { SearchQueryDto } from "../search/dto/search-query.dto";
import { contains } from "class-validator";
import { paginate } from "../common/pagination/paginate";

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
        const {page, limit, ...filters} = query;
        return paginate(this.prisma.professional, {
            where: {
                name: { contains: filters.q, mode: 'insensitive' },
            },
            include: {
                industry: true,
                education: true,
            },
            page: page,
            limit: limit,
            orderBy: { createdAt: 'desc' },
        });
    }
}