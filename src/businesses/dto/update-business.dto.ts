import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { RegisterFor } from '@prisma/client';

export class UpdateBusinessDto {
    @IsOptional()
    @IsEnum(RegisterFor)
    registerFor: RegisterFor;

    @IsOptional()
    @IsString()
    ownerName: string;

    @IsOptional()
    @IsString()
    businessType: string;

    @IsOptional()
    @IsString()
    yearsOfExperience: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    contactNumber: string;

    @IsOptional()
    @IsString()
    city: string;

    @IsOptional()
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
}