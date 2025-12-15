import { Module } from "@nestjs/common";
import { SearchService } from "./search.service";
import { SearchController } from "./search.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { ProfessionalsModule } from "../professionals/professionals.module";
import { BusinessesModule } from "../businesses/businesses.module";
@Module({
    imports: [PrismaModule, AuthModule, ProfessionalsModule, BusinessesModule],
    controllers: [SearchController],
    providers: [SearchService],
    exports: [SearchService]
})
export class SearchModule {}