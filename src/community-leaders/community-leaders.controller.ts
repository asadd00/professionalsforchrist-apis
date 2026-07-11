import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.authguard';
import { AdminAuthGuard } from '../auth/admin.authguard';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { CommunityLeadersService } from './community-leaders.service';
import { CreateCommunityLeaderDto } from './dto/create-community-leader.dto';
import { UpdateCommunityLeaderDto } from './dto/update-community-leader.dto';
import { CommunityLeaderQueryDto } from './dto/community-leader-query.dto';

@Controller('community-leaders')
@UseGuards(JwtAuthGuard)
export class CommunityLeadersController {
  constructor(private communityLeadersService: CommunityLeadersService) {}

  @Get()
  findAll(@Query() query: CommunityLeaderQueryDto) {
    return this.communityLeadersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.communityLeadersService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  @UseGuards(AdminAuthGuard)
  @ResponseMessage('Community leader created')
  create(@Body() dto: CreateCommunityLeaderDto) {
    return this.communityLeadersService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  @ResponseMessage('Community leader updated')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCommunityLeaderDto) {
    return this.communityLeadersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @ResponseMessage('Community leader deleted')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.communityLeadersService.delete(id);
  }
}
