import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],       // Import PrismaService to use in UsersService
  controllers: [UsersController], // Handles HTTP requests
  providers: [AuthService, UsersService],      // Business logic & database calls
  exports: [UsersService],        // Export if other modules (e.g., AuthModule) need it
})
export class UsersModule {}
