import { IsEmail, IsString } from "class-validator";

export class CreateBusinessDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

}