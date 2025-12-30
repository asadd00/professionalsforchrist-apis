import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { BusinessesModule } from 'src/businesses/businesses.module';
import { ProfessionalsModule } from 'src/professionals/professionals.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule), BusinessesModule, ProfessionalsModule],
  controllers: [UsersController],
  providers: [AuthService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
