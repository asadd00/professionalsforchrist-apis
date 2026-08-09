import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePodcastDto } from './dto/update-podcast.dto';

const SINGLETON_ID = 1;

@Injectable()
export class PodcastService {
  constructor(private prisma: PrismaService) {}

  get() {
    return this.prisma.podcastSettings.upsert({
      where: { id: SINGLETON_ID },
      update: {},
      create: { id: SINGLETON_ID, youtubeUrl: null },
    });
  }

  update(data: UpdatePodcastDto) {
    return this.prisma.podcastSettings.upsert({
      where: { id: SINGLETON_ID },
      update: { youtubeUrl: data.youtubeUrl },
      create: { id: SINGLETON_ID, youtubeUrl: data.youtubeUrl ?? null },
    });
  }
}
