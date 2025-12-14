import { PrismaService } from "src/prisma/prisma.service";
import { CreateBusinessDto } from "./dto/create-business.dto";
import { Injectable } from "@nestjs/common";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import { SearchQueryDto } from "src/search/dto/search-query.dto";
import { paginate } from "src/common/pagination/paginate";

@Injectable()
export class BusinessesService {
    constructor(private prisma: PrismaService) { }

    create(data: CreateBusinessDto) {
        // return this.prisma.business.create({
        //     data
        // });
    }

    findAllByUserId(userId: number) {
        // return this.prisma.business.findMany({
        //     where: {
        //         createdById: userId
        //     }
        // });
    }

    update(id: number, userId: number, data: UpdateBusinessDto) {
        // return this.prisma.business.update({
        //     where: {
        //         id,
        //         createdById: userId
        //     },
        //     data
        // });
    }

    delete(id: number, userId: number) {
        // return this.prisma.business.delete({
        //     where: {
        //         id,
        //         createdById: userId
        //     }
        // });
    }

    /**
     * admin
     */

    findAll(query: SearchQueryDto) {
        // return paginate(this.prisma.business, {
        //     where: {
        //         deletedAt: null,
        //     },
        //     page: query.page,
        //     limit: query.limit,
        //     orderBy: { createdAt: 'desc' },
        // });
    }
}