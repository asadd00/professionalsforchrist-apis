import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.authguard";
import { MetaService } from "./meta.service";

@Controller('meta')
export class MetaController {
    constructor (private metaService: MetaService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    getMeta() {
        return this.metaService.getMeta();
    }
}