import { Body, ConflictException, Controller, Delete, Get, HttpCode, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CreateBusinessDto } from "./dto/create-business.dto";
import { BusinessesService } from "./businesses.service";
import { User } from "../common/decorators/user.decorator";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import { JwtAuthGuard } from "../auth/jwt.authguard";
import { SearchQueryDto } from "../search/dto/search-query.dto";
import { AdminAuthGuard } from "src/auth/admin.authguard";
import { ResponseMessage } from "src/common/decorators/response-message.decorator";
import { RegisterFor } from "@prisma/client";

@Controller('businesses')
@UseGuards(JwtAuthGuard)
export class BusinessesController {
    constructor (private businessesService: BusinessesService){}

    @Post()
    @HttpCode(201)
    @ResponseMessage('Form submitted successfully')
    async create(
        @User('userId') userId: number, 
        @Body() dto: CreateBusinessDto
    ) {
        const existing = await this.businessesService.findForSelf(userId);
        if(existing && dto.registerFor == RegisterFor.self) throw new ConflictException('Form alreay exists for yourself');

        dto.createdById = userId;
        return this.businessesService.create(dto);
    }

    @Get('by-me')
    findAllByUserId(@User('userId') userId: number) {
        return this.businessesService.findAllByUserId(userId);
    }

    @Get('/for-self')
    async findForSelf(@User('userId') userId: number) {
        const result = await this.businessesService.findForSelf(userId);
        if(!result){
            throw new NotFoundException('Business not found');
        }

        return result;
    }

    @Patch('for-self/:id')
    @ResponseMessage('Form updated successfully')
    updateForSelf(
        @Param('id', ParseIntPipe) id: number, 
        @User('userId') userId: number, 
        @Body() dto: UpdateBusinessDto
    ) {
        return this.businessesService.updateForSelf(id, userId, dto)
    }

    @Patch(':id')
    @ResponseMessage('Form updated successfully')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() dto: UpdateBusinessDto
    ) {
        return this.businessesService.update(id, dto)
    }
    
    @Delete(':id')
    @ResponseMessage('Form deleted')
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