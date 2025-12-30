import { PrismaService } from "../prisma/prisma.service";
import { CreateProfessionalDto } from "./dto/create-professional.dto";
import { Injectable } from "@nestjs/common";
import { UpdateProfessionalDto } from "./dto/update-professional.dto";
import { SearchQueryDto } from "../search/dto/search-query.dto";
import { contains } from "class-validator";
import { paginate } from "../common/pagination/paginate";
import { RegisterFor } from "@prisma/client";

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

    findForSelf(userId: number) {
        return this.prisma.professional.findFirst({
            where: {
                createdById: userId,
                registerFor: RegisterFor.self
            }
        });
    }

    updateForSelf(id: number, userId: number, data: UpdateProfessionalDto) {
        return this.prisma.professional.update({
            where: {
                id,
                registerFor: RegisterFor.self,
                createdById: userId
            },
            data
        });
    }

    update(id: number, data: UpdateProfessionalDto) {
        return this.prisma.professional.update({
            where: {
                id,
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

    deleteAllByUserId(userId: number) {
        return this.prisma.professional.deleteMany({
            where: {
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
                deletedAt: null,
                OR: [
                    { name: { contains: filters.q, mode: 'insensitive' } },
                    { occupation: { contains: filters.q, mode: 'insensitive' } },
                    { jobTitle: { contains: filters.q, mode: 'insensitive' } },
                    { residentialArea: { contains: filters.q, mode: 'insensitive' } },
                    { employer: { contains: filters.q, mode: 'insensitive' } },
                    { churchName: { contains: filters.q, mode: 'insensitive' } },
                    { city: { contains: filters.q, mode: 'insensitive' } },
                    {
                        industry: {
                            is: {
                                name: { contains: filters.q, mode: 'insensitive' },
                            },
                        },
                    },
                ],
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