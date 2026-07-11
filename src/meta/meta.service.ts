import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MetaService {
    constructor (private prisma: PrismaService) {}

    async getMeta() {

        const [industries, educations, prayerTypes] = await Promise.all([
            this.prisma.industry.findMany({
                where: {
                    isActive: true
                },
                orderBy: {
                    id: 'asc'
                }
            }),
            this.prisma.education.findMany({
                where: {
                    isActive: true
                },
                orderBy: {
                    id: 'asc'
                }
            }),
            this.prisma.prayerType.findMany({
                where: {
                    isActive: true
                },
                orderBy: {
                    id: 'asc'
                }
            })
        ]);

        return {industries, educations, prayerTypes};
    }
}