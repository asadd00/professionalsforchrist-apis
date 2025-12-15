import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, SetMetadata, UseGuards } from "@nestjs/common";
import { CreateProfessionalDto } from "./dto/create-professional.dto";
import { ProfessionalService } from "./professionals.service";
import { User } from "src/common/decorators/user.decorator";
import { UpdateProfessionalDto } from "./dto/update-professional.dto";
import { JwtAuthGuard } from "src/auth/jwt.authguard";
import { SearchQueryDto } from "src/search/dto/search-query.dto";

@Controller('professionals')
@UseGuards(JwtAuthGuard)
export class ProfessionalsController {
    constructor (private professionalService: ProfessionalService){}

    @Post()
    @HttpCode(201)
    @SetMetadata('message', 'Form submitted successfully')
    create(
        @User('userId') userId: number,
        @Body() dto: CreateProfessionalDto
    ) {
        dto.createdById = userId;
        return this.professionalService.create(dto);
    }

    @Get('/by-me')
    findAllByUserId(@User('userId') userId: number) {
        return this.professionalService.findAllByUserId(userId);
    }

    @Patch(':id')
    @SetMetadata('message', 'Form updated successfully')
    update(
        @Param('id', ParseIntPipe) id: number, 
        @User('userId') userId: number, 
        @Body() dto: UpdateProfessionalDto
    ) {
        return this.professionalService.update(id, userId, dto)
    }
    
    @Delete(':id')
    @SetMetadata('message', 'Form deleted')
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