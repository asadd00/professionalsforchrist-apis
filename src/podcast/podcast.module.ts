import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PodcastController } from './podcast.controller';
import { PodcastService } from './podcast.service';

@Module({
  imports: [AuthModule],
  controllers: [PodcastController],
  providers: [PodcastService],
})
export class PodcastModule {}
