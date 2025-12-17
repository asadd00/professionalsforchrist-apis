import {
  IsString,
  IsEmail,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
  IsNotEmpty,
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
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  contactNumber?: string;

  @IsOptional()
  @IsBoolean()
  shouldNumberVisible?: boolean;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;

  /* ---------- CHURCH INFO ---------- */

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  churchName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  churchArea?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
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
  @IsNotEmpty()
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
  @IsNotEmpty()
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
  @IsNotEmpty()
  residentialAddress?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  residentialArea?: string;

  /* ---------- OPTIONAL LINKS / NOTES ---------- */

  @IsOptional()
  @IsString()
  linkedInUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;


  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}