import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }


    create(data: CreateUserDto) {
        return this.prisma.user.create({ 
            data
        });
    }

    findAll() {
        return this.prisma.user.findMany({ select: { id: true, email: true, name: true } });
    }

    findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
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
}