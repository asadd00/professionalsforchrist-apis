import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { MetaController } from "./meta.controller";
import { MetaService } from "./meta.service";

@Module({
    imports: [AuthModule, PrismaModule],
    controllers: [MetaController],
    providers: [MetaService]
})
export class MetaModule {}