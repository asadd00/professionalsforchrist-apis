import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotableBusinessesController } from './notable-businesses.controller';
import { NotableBusinessesService } from './notable-businesses.service';

@Module({
  imports: [AuthModule],
  controllers: [NotableBusinessesController],
  providers: [NotableBusinessesService],
  exports: [NotableBusinessesService],
})
export class NotableBusinessesModule {}
