import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateProfessionalDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

}