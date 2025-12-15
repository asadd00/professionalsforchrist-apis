import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, SetMetadata, UseGuards } from "@nestjs/common";
import { CreateBusinessDto } from "./dto/create-business.dto";
import { BusinessesService } from "./businesses.service";
import { User } from "../common/decorators/user.decorator";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import { JwtAuthGuard } from "../auth/jwt.authguard";
import { SearchQueryDto } from "../search/dto/search-query.dto";

@Controller('businesses')
@UseGuards(JwtAuthGuard)
export class BusinessesController {
    constructor (private businessesService: BusinessesService){}

    @Post()
    @HttpCode(201)
    @SetMetadata('message', 'Form submitted successfully')
    create(
        @User('userId') userId: number, 
        @Body() dto: CreateBusinessDto
    ) {
        dto.createdById = userId;
        return this.businessesService.create(dto);
    }

    @Get('by-me')
    findAllByUserId(@User('userId') userId: number) {
        return this.businessesService.findAllByUserId(userId);
    }

    @Patch(':id')
    @SetMetadata('message', 'Form updated successfully')
    update(
        @Param('id', ParseIntPipe) id: number, 
        @User('userId') userId: number, 
        @Body() dto: UpdateBusinessDto
    ) {
        return this.businessesService.update(id, userId, dto)
    }
    
    @Delete(':id')
    @SetMetadata('message', 'Form deleted')
    delete(
        @Param('id', ParseIntPipe) id: number,
        @User('userId') userId: number,
    ) {
        return this.businessesService.delete(id, userId);
    }

    /**
     * admin
     */

    @Get()
    findAll(@Query() query: SearchQueryDto) {
        return this.businessesService.findAll(query);
    }
}