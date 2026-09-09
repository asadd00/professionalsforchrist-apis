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

export class CreateProfessionalDto {
  /* ---------- BASIC INFO ---------- */

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @IsBoolean()
  shouldNumberVisible: boolean;

  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (value === '' ? undefined : value))
  dateOfBirth?: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => (value === '' ? undefined : value))
  email?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  createdById?: number; // self-serve route always overwrites this from the token; admin route may supply it explicitly

  /* ---------- CHURCH INFO ---------- */

  @IsString()
  @IsNotEmpty()
  churchName: string;

  @IsString()
  @IsNotEmpty()
  churchArea: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  /* ---------- EDUCATION ---------- */

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  lastEducationId?: number;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value ?? undefined)
  lastDegreeName?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value ?? undefined)
  lastInstituteAttended?: string;

  /* ---------- EMPLOYMENT ---------- */

  @IsBoolean()
  isEmployed: boolean;

  @IsString()
  @IsNotEmpty()
  occupation: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  industryId: number;

  @IsString()
  @IsOptional()
  otherIndustry?: string

  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @IsString()
  @IsNotEmpty()
  employer: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
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

  @IsString()
  @IsNotEmpty()
  residentialArea: string;

  /* ---------- OPTIONAL LINKS / NOTES ---------- */

  @IsOptional()
  @IsString()
  linkedInUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
