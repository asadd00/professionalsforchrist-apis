import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { BusinessesController } from "./businesses.controller";
import { BusinessesService } from "./businesses.service";

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [BusinessesController],
    providers: [BusinessesService],
    exports: [BusinessesService]
})
export class BusinessesModule{}
