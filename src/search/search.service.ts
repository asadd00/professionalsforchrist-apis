import { BusinessesService } from "src/businesses/businesses.service";
import { ProfessionalService } from "src/professionals/professionals.service";
import { SearchQueryDto } from "./dto/search-query.dto";

export class SearchService {
    constructor (private professionalService: ProfessionalService, private businessService: BusinessesService) {}

    search(data: SearchQueryDto) {
        const professionals = this.professionalService.findAll(data);
        const businesses = this.businessService.findAll(data);

        return {professionals, businesses};
    }
}