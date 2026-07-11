import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CommunityLeadersController } from './community-leaders.controller';
import { CommunityLeadersService } from './community-leaders.service';

@Module({
  imports: [AuthModule],
  controllers: [CommunityLeadersController],
  providers: [CommunityLeadersService],
  exports: [CommunityLeadersService],
})
export class CommunityLeadersModule {}
