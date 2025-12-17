import { IsString, IsOptional, IsEmail, IsEnum, IsNotEmpty, IsBoolean } from 'class-validator';
import { RegisterFor } from '@prisma/client';

export class UpdateBusinessDto {
    @IsOptional()
    @IsEnum(RegisterFor)
    registerFor: RegisterFor;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    ownerName: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    businessType: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    yearsOfExperience: string;
    
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    dateOfBirth: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    contactNumber: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    city: string;

    @IsOptional()
    @IsNotEmpty()
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

    @IsOptional()
    @IsBoolean()
    isVerified?: boolean;
}