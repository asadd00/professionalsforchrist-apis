import { Body, ConflictException, Controller, Delete, Get, HttpCode, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CreateProfessionalDto } from "./dto/create-professional.dto";
import { ProfessionalService } from "./professionals.service";
import { User } from "../common/decorators/user.decorator";
import { UpdateProfessionalDto } from "./dto/update-professional.dto";
import { JwtAuthGuard } from "../auth/jwt.authguard";
import { SearchQueryDto } from "../search/dto/search-query.dto";
import { AdminAuthGuard } from "src/auth/admin.authguard";
import { ResponseMessage } from "src/common/decorators/response-message.decorator";
import { RegisterFor } from "@prisma/client";

@Controller('professionals')
@UseGuards(JwtAuthGuard)
export class ProfessionalsController {
    constructor (private professionalService: ProfessionalService){}

    @Post()
    @HttpCode(201)
    @ResponseMessage('Form submitted successfully')
    async create(
        @User('userId') userId: number,
        @Body() dto: CreateProfessionalDto
    ) {
        const existing = await this.professionalService.findForSelf(userId);
        if(existing && dto.registerFor == RegisterFor.self) throw new ConflictException('Form alreay exists for yourself');

        dto.createdById = userId;
        return this.professionalService.create(dto);
    }

    @Get('/by-me')
    findAllByUserId(@User('userId') userId: number) {
        return this.professionalService.findAllByUserId(userId);
    }

    @Get('/for-self')
    async findForSelf(@User('userId') userId: number) {
        const result = await this.professionalService.findForSelf(userId);
        if(!result){
            throw new NotFoundException('Profession not found');
        }

        return result;
    }

    @Patch('/for-self/:id')
    @ResponseMessage('Form updated successfully')
    updateForSelf(
        @Param('id', ParseIntPipe) id: number, 
        @User('userId') userId: number, 
        @Body() dto: UpdateProfessionalDto
    ) {
        return this.professionalService.updateForSelf(id, userId, dto)
    }

    @Patch(':id')
    @ResponseMessage('Form updated successfully')
    @UseGuards(AdminAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() dto: UpdateProfessionalDto
    ) {
        return this.professionalService.update(id, dto)
    }
    
    @Delete(':id')
    @ResponseMessage('Form deleted')
    delete(
        @Param('id', ParseIntPipe) id: number,
        @User('userId') userId: number,
    ) {
        return this.professionalService.delete(id, userId);
    }

    /**
     * admin
     */

    @Get()
    findAll(@Query() query: SearchQueryDto) {
        return this.professionalService.findAll(query);
    }
}