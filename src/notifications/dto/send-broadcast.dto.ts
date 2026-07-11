import { IsNotEmpty, IsString } from 'class-validator';

export class SendBroadcastDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
