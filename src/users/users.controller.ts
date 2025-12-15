import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, SetMetadata, UseGuards } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt.authguard";
import { User } from "../common/decorators/user.decorator";
import { UsersSearchQueryDto } from "./dto/search-user.dto";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post()
    @HttpCode(201)
    @SetMetadata('message', 'User created successfully')
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    @Get()
    findAll(@Query() dto: UsersSearchQueryDto) {
        return this.usersService.findAll(dto);
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    findMe(@User('userId') userId: number) {
        return this.usersService.findById(userId);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
        return this.usersService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.delete(id);
    }

}