import { IsDateString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

const emptyToUndefined = ({ value }: { value: unknown }) => (value === '' ? undefined : value);

export class ExportUsersQueryDto {
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsDateString()
  from?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsDateString()
  to?: string;
}
