import { IsOptional, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePodcastDto {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => (value === '' ? null : value))
  @IsUrl({}, { message: 'youtubeUrl must be a valid URL' })
  youtubeUrl?: string | null;
}
