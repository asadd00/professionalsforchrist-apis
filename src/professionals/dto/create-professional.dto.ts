import { IsEmail, IsString } from "class-validator";

export class CreateProfessionalDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

}