import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../prisma/prisma.module";
import { ProfessionalsController } from "./professionals.controller";
import { ProfessionalService } from "./professionals.service";

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [ProfessionalsController],
    providers: [ProfessionalService],
    exports: [ProfessionalService]
})
export class ProfessionalsModule{}
