import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { paginate } from "../common/pagination/paginate";
import { SearchQueryDto } from "src/search/dto/search-query.dto";

const SALT_ROUNDS = 10;

function withoutPassword<T extends { password?: string | null }>(user: T): Omit<T, 'password'> {
    const { password, ...rest } = user;
    return rest;
}

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }


    async create(data: CreateUserDto) {
        const password = data.password ? await bcrypt.hash(data.password, SALT_ROUNDS) : undefined;

        const user = await this.prisma.user.upsert({
            where: {
                email_loginType: {
                    email: data.email,
                    loginType: data.loginType
                },
            },
            update: {

            },
            create: {
                ...data,
                password,
            },
        });

        return withoutPassword(user);
    }

    async findById(id: number) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        return user ? withoutPassword(user) : null;
    }

    findByEmailAndLoginType(email: string, loginType: string) {
        return this.prisma.user.findUnique({ where: { email_loginType: { email, loginType } } });
    }

    async update(id: number, data: UpdateUserDto) {
        const user = await this.prisma.user.update({ where: { id }, data });
        return withoutPassword(user);
    }

    async delete(id: number) {
        const user = await this.prisma.user.delete({ where: { id } });
        return withoutPassword(user);
    }

    async findAll(myUserId: number, query: SearchQueryDto) {
        const {page, limit, ...filters} = query;
        const result = await paginate(this.prisma.user, {
            where: {
                NOT: {
                    id: myUserId,
                },
                name: { contains: filters.q, mode: 'insensitive' },
            },
            page: page,
            limit: limit,
            orderBy: { createdAt: 'desc' },
        });

        return { ...result, list: result.list.map(withoutPassword) };
    }
}