import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MetaService {
    constructor (private prisma: PrismaService) {}

    async getMeta() {

        const [industries, educations] = await Promise.all([
            this.prisma.industry.findMany({
                where: {
                    isActive: true
                }
            }),
            this.prisma.education.findMany({
                where: {
                    isActive: true
                }
            })
        ]);

        return {industries, educations};
    }
}