import { IsNotEmpty, IsString } from 'class-validator';

export class SendEducationFundNotificationDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
