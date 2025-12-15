import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfessionalsModule } from './professionals/professionals.module';
import { BusinessesModule } from './businesses/businesses.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    PrismaModule, 
    UsersModule, 
    AuthModule, 
    ProfessionalsModule,
    BusinessesModule,
    SearchModule,
  ],
})
export class AppModule {}
