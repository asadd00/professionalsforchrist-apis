import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt.authguard";
import { SearchService } from "./search.service";
import { SearchQueryDto } from "./dto/search-query.dto";

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
    constructor (private searchService: SearchService) {}

    @Get()
    search(@Query() query: SearchQueryDto) {
        return this.searchService.search(query);
    }
    
}