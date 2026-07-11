import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfessionalsModule } from './professionals/professionals.module';
import { BusinessesModule } from './businesses/businesses.module';
import { SearchModule } from './search/search.module';
import { MetaModule } from './meta/meta.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NotableBusinessesModule } from './notable-businesses/notable-businesses.module';
import { CommunityLeadersModule } from './community-leaders/community-leaders.module';
import { PrayerRequestsModule } from './prayer-requests/prayer-requests.module';
import { EducationFundModule } from './education-fund/education-fund.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ProfessionalsModule,
    BusinessesModule,
    SearchModule,
    MetaModule,
    NotificationsModule,
    NotableBusinessesModule,
    CommunityLeadersModule,
    PrayerRequestsModule,
    EducationFundModule,
    ReportsModule
  ],
})
export class AppModule {}
