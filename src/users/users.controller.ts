import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt.authguard";
import { User } from "../common/decorators/user.decorator";
import { AdminAuthGuard } from "src/auth/admin.authguard";
import { ResponseMessage } from "src/common/decorators/response-message.decorator";
import { SearchQueryDto } from "src/search/dto/search-query.dto";
import { ProfessionalService } from "src/professionals/professionals.service";
import { BusinessesService } from "src/businesses/businesses.service";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService, private professionalService: ProfessionalService, private businessService: BusinessesService) { }

    @Post()
    @HttpCode(201)
    @ResponseMessage('User created successfully')
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, AdminAuthGuard)
    findAll(@User('userId') userId: number, @Query() dto: SearchQueryDto) {
        return this.usersService.findAll(userId, dto);
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    findMe(@User('userId') userId: number) {
        return this.usersService.findById(userId);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    updateMe(@User('userId') userId: number, @Body() dto: UpdateUserDto) {
        return this.usersService.update(userId, dto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, AdminAuthGuard)
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
        return this.usersService.update(id, dto);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    deleteMe(@User('userId') userId: number) {
        return this.usersService.delete(userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminAuthGuard)
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.professionalService.deleteAllByUserId(id);
        await this.businessService.deleteAllByUserId(id);
        return await this.usersService.delete(id);
    }

}