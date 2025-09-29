import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ApplicationsModule } from './applications/applications.module';
import { UsersModule } from './users/users.module';
import { InterviewsModule } from './interviews/interviews.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ApplicationsModule,
    UsersModule,
    InterviewsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
