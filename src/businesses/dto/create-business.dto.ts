import { IsString, IsOptional, IsEmail, IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { RegisterFor } from '@prisma/client';

export class CreateBusinessDto {
  @IsEnum(RegisterFor)
  registerFor: RegisterFor;

  @IsString()
  @IsNotEmpty()
  ownerName: string;

  @IsString()
  @IsNotEmpty()
  businessType: string;

  @IsString()
  @IsNotEmpty()
  yearsOfExperience: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
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
