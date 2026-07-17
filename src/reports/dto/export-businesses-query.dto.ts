import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

const emptyToUndefined = ({ value }: { value: unknown }) => (value === '' ? undefined : value);

export class ExportBusinessesQueryDto {
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
  @IsString()
  businessType?: string;

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
