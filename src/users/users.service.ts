import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { paginate } from "../common/pagination/paginate";
import { UsersSearchQueryDto } from "./dto/search-user.dto";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }


    create(data: CreateUserDto) {
        return this.prisma.user.upsert({ 
            where: {
                email_loginType: {
                    email: data.email,
                    loginType: data.loginType
                },
            },
            update: {

            },
            create: {
                ...data
            }
        });
    }

    findById(id: number) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    update(id: number, data: UpdateUserDto) {
        return this.prisma.user.update({ where: { id }, data });
    }

    delete(id: number) {
        return this.prisma.user.delete({ where: { id } });
    }

    findAll(query: UsersSearchQueryDto) {
        const {page, limit, ...filters} = query;
        return paginate(this.prisma.user, {
            where: {
                name: { contains: filters.name, mode: 'insensitive' },
            },
            page: page,
            limit: limit,
            orderBy: { createdAt: 'desc' },
        });
    }
}