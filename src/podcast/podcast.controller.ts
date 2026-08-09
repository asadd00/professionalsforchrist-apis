import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../auth/admin.authguard';
import { JwtAuthGuard } from '../auth/jwt.authguard';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { PodcastService } from './podcast.service';
import { UpdatePodcastDto } from './dto/update-podcast.dto';

@Controller('podcast')
export class PodcastController {
  constructor(private podcastService: PodcastService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  get() {
    return this.podcastService.get();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ResponseMessage('Podcast link updated')
  update(@Body() dto: UpdatePodcastDto) {
    return this.podcastService.update(dto);
  }
}
