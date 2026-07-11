import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePrayerRequestDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @Type(() => Number)
  @IsInt()
  prayerTypeId: number;

  @IsString()
  @IsNotEmpty()
  prayerText: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  createdById?: number; // always overwritten from the token in the controller
}
