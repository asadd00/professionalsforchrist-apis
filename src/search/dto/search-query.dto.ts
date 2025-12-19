import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SearchQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === null || value === undefined || value === ''
      ? 1
      : Number(value),
  )
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({ value }) =>
    value === null || value === undefined || value === ''
      ? 10
      : Number(value),
  )
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
