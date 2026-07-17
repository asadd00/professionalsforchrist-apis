import { IsArray, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

const emptyToUndefined = ({ value }: { value: unknown }) => (value === '' ? undefined : value);

export class ExportProfessionalsQueryDto {
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsDateString()
  from?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsDateString()
  to?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  city?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @Type(() => Number)
  @IsInt()
  industryId?: number;

  @IsOptional()
  @Transform(emptyToUndefined)
  @Type(() => Number)
  @IsInt()
  lastEducationId?: number;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  yearsOfExperience?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  q?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  churchName?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  residentialArea?: string;

  // Sent as a comma-separated string from a plain <form method="GET"> checkbox group;
  // normalized to an array here so the service can look columns up by key.
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === '' ? undefined : Array.isArray(value) ? value : String(value).split(','),
  )
  @IsArray()
  @IsString({ each: true })
  columns?: string[];
}
