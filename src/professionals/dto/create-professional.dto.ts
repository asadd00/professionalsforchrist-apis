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

export class CreateProfessionalDto {
  /* ---------- BASIC INFO ---------- */

  @IsEnum(RegisterFor)
  registerFor: RegisterFor;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  contactNumber: string;

  @IsBoolean()
  shouldNumberVisible: boolean;

  @IsEnum(Gender)
  gender: Gender;

  createdById: number; //adding later from token

  /* ---------- CHURCH INFO ---------- */

  @IsString()
  churchName: string;

  @IsString()
  churchArea: string;

  @IsString()
  city: string;

  /* ---------- EDUCATION ---------- */

  @Type(() => Number)
  @IsInt()
  @Min(1)
  lastEducationId: number;

  @IsString()
  lastDegreeName: string;

  @IsString()
  lastInstituteAttended: string;

  /* ---------- EMPLOYMENT ---------- */

  @IsBoolean()
  isEmployed: boolean;

  @IsString()
  occupation: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  industryId?: number;

  @IsString()
  @IsOptional()
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

  @IsString()
  residentialAddress: string;

  @IsString()
  residentialArea: string;

  /* ---------- OPTIONAL LINKS / NOTES ---------- */

  @IsOptional()
  @IsString()
  linkedInUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
