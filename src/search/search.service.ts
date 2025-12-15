import { BusinessesService } from "../businesses/businesses.service";
import { ProfessionalService } from "../professionals/professionals.service";
import { SearchQueryDto } from "./dto/search-query.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SearchService {
    constructor(private professionalService: ProfessionalService, private businessService: BusinessesService) { }

    async search(data: SearchQueryDto) {
        const [professionalsPage, businessesPage] = await Promise.all([
            this.professionalService.findAll(data),
            this.businessService.findAll(data),
        ]);

        return {
            professionals: professionalsPage,
            businesses: businessesPage,
        };
    }
}