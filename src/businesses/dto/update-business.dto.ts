import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateBusinessDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

}