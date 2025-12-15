import { IsString, IsOptional, IsEmail, IsEnum, IsInt } from 'class-validator';
import { RegisterFor } from '@prisma/client';

export class CreateBusinessDto {
  @IsEnum(RegisterFor)
  registerFor: RegisterFor;

  @IsString()
  ownerName: string;

  @IsString()
  businessType: string;

  @IsString()
  yearsOfExperience: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  contactNumber: string;

  @IsString()
  city: string;

  @IsString()
  residentialArea: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  fbPage?: string;

  @IsOptional()
  @IsString()
  instaPage?: string;

  @IsOptional()
  @IsString()
  linkedInUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  createdById: number; //adding later from token
}
