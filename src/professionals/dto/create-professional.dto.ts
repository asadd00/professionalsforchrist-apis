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
import { RegisterFor, Gender } from '@prisma/client';

export class CreateProfessionalDto {
  /* ---------- BASIC INFO ---------- */

  @IsEnum(RegisterFor)
  registerFor: RegisterFor;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @IsBoolean()
  shouldNumberVisible: boolean;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;

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

  @Type(() => Number)
  @IsInt()
  @Min(1)
  lastEducationId: number;

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
  @IsOptional()
  industryId?: number;

  @IsString()
  @IsOptional()
  otherIndustry?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  employer?: string;

  @IsString()
  @IsNotEmpty()
  yearsOfExperience: string;
  
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
  residentialAddress: string;

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
