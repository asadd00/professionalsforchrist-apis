import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { SearchQueryDto } from '../../search/dto/search-query.dto';

export class CommunityLeaderQueryDto extends SearchQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  industryId?: number;
}
