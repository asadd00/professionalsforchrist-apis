import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfessionalsModule } from './professionals/professionals.module';
import { BusinessesModule } from './businesses/businesses.module';

@Module({
  imports: [
    PrismaModule, 
    UsersModule, 
    AuthModule, 
    ProfessionalsModule,
    BusinessesModule,
  ],
})
export class AppModule {}
