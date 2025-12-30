import { PrismaService } from "../prisma/prisma.service";
import { CreateBusinessDto } from "./dto/create-business.dto";
import { Injectable } from "@nestjs/common";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import { SearchQueryDto } from "../search/dto/search-query.dto";
import { paginate } from "../common/pagination/paginate";
import { RegisterFor } from "@prisma/client";

@Injectable()
export class BusinessesService {
    constructor(private prisma: PrismaService) { }

    create(data: CreateBusinessDto) {
        return this.prisma.business.create({
            data
        });
    }

    findAllByUserId(userId: number) {
        return this.prisma.business.findMany({
            where: {
                createdById: userId
            }
        });
    }

    findForSelf(userId: number) {
        return this.prisma.business.findFirst({
            where: {
                createdById: userId,
                registerFor: RegisterFor.self
            }
        });
    }

    updateForSelf(id: number, userId: number, data: UpdateBusinessDto) {
        return this.prisma.business.update({
            where: {
                id,
                registerFor: RegisterFor.self,
                createdById: userId
            },
            data
        });
    }

    update(id: number, data: UpdateBusinessDto) {
        return this.prisma.business.update({
            where: {
                id,
            },
            data
        });
    }

    delete(id: number, userId: number) {
        return this.prisma.business.delete({
            where: {
                id,
                createdById: userId
            }
        });
    }

    deleteAllByUserId(userId: number) {
        return this.prisma.business.deleteMany({
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
        return paginate(this.prisma.business, {
            where: {
                deletedAt: null,
                OR: [
                    { ownerName: { contains: filters.q, mode: 'insensitive' } },
                    { businessType: { contains: filters.q, mode: 'insensitive' } },
                    { residentialArea: { contains: filters.q, mode: 'insensitive' } },
                ],
            },
            page: page,
            limit: limit,
            orderBy: { createdAt: 'desc' },
        });
    }
}