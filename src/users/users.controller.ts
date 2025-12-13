import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, SetMetadata, UseGuards } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/jwt.authguard";
import { User } from "src/common/decorators/user.decorator";

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
    findAll() {
        return this.usersService.findAll();
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