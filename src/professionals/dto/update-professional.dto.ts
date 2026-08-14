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
import { Type, Transform } from 'class-transformer';
import { Gender } from '@prisma/client';

export class UpdateProfessionalDto {
  /* ---------- BASIC INFO ---------- */

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEmail()
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
  dateOfBirth?: string;

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
  @Transform(({ value }) => value ?? undefined)
  lastDegreeName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? undefined)
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
  @IsNotEmpty()
  employer?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  yearsOfExperience?: string;

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
