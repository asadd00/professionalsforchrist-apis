import { IsBoolean, IsEmail, IsEnum, IsString } from "class-validator";

export class CreateProfessionalDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsEnum({})
    registerFor: string;

    contactNumber: string;

    shouldNumberVisible: string;

    @IsEnum({})
    gender: String;

    churchName: String;

    churchArea: String;

    city: String;

    lastEducationId: number;

    lastDegreeName: String;

    lastInstituteAttended: String;

    @IsBoolean()
    isEmployed: boolean;

    occupation: String;

    industryId: number;

    jobTitle: String;

    employer: String;
    
    residentialAddress: String;

    residentialArea: String;

    linkedInUrl: String;

    notes: String;
}