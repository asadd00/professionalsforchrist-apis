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
import { NotableBusinessesService } from './notable-businesses.service';
import { CreateNotableBusinessDto } from './dto/create-notable-business.dto';
import { UpdateNotableBusinessDto } from './dto/update-notable-business.dto';
import { NotableBusinessQueryDto } from './dto/notable-business-query.dto';

@Controller('notable-businesses')
@UseGuards(JwtAuthGuard)
export class NotableBusinessesController {
  constructor(private notableBusinessesService: NotableBusinessesService) {}

  @Get()
  findAll(@Query() query: NotableBusinessQueryDto) {
    return this.notableBusinessesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notableBusinessesService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  @UseGuards(AdminAuthGuard)
  @ResponseMessage('Notable business created')
  create(@Body() dto: CreateNotableBusinessDto) {
    return this.notableBusinessesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  @ResponseMessage('Notable business updated')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNotableBusinessDto) {
    return this.notableBusinessesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @ResponseMessage('Notable business deleted')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.notableBusinessesService.delete(id);
  }
}
