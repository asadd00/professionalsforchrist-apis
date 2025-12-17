import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SocialLoginDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  socialId?: string;

  @IsOptional()
  @IsString()
  loginType: string;
}