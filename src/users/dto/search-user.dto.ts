import { SearchQueryDto } from "src/search/dto/search-query.dto";
import { IsOptional, IsString } from 'class-validator';

export class UsersSearchQueryDto extends SearchQueryDto {
    @IsOptional()
    @IsString()
    name?: string;
}