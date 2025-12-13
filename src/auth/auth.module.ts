import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [forwardRef(() => UsersModule)],      // use forwardRef to break circular dependency
  providers: [AuthService],    // Auth logic with jsonwebtoken
  controllers: [AuthController], // Login route
})
export class AuthModule {}
