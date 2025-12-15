import {
  IsString,
  IsEmail,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RegisterFor, Gender } from '@prisma/client';

export class UpdateProfessionalDto {
  /* ---------- BASIC INFO ---------- */

  @IsOptional()
  @IsEnum(RegisterFor)
  registerFor?: RegisterFor;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsBoolean()
  shouldNumberVisible?: boolean;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  /* ---------- CHURCH INFO ---------- */

  @IsOptional()
  @IsString()
  churchName?: string;

  @IsOptional()
  @IsString()
  churchArea?: string;

  @IsOptional()
  @IsString()
  city?: string;

  /* ---------- EDUCATION ---------- */

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  lastEducationId?: number;

  @IsOptional()
  @IsString()
  lastDegreeName?: string;

  @IsOptional()
  @IsString()
  lastInstituteAttended?: string;

  /* ---------- EMPLOYMENT ---------- */

  @IsOptional()
  @IsBoolean()
  isEmployed?: boolean;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  industryId?: number;

  @IsOptional()
  @IsString()
  otherIndustry?: string

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  employer?: string;

  @IsOptional()
  @IsString()
  lastEmployer1?: string;

  @IsOptional()
  @IsString()
  lastEmployer2?: string;

  @IsOptional()
  @IsString()
  lastEmployer3?: string;

  /* ---------- ADDRESS ---------- */

  @IsOptional()
  @IsString()
  residentialAddress?: string;

  @IsOptional()
  @IsString()
  residentialArea?: string;

  /* ---------- OPTIONAL LINKS / NOTES ---------- */

  @IsOptional()
  @IsOptional()
  @IsString()
  linkedInUrl?: string;

  @IsOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}