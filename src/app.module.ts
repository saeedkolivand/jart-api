import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ApplicationsModule } from './applications/applications.module';
import { UsersModule } from './users/users.module';
import { InterviewsModule } from './interviews/interviews.module';

@Module({
  imports: [PrismaModule, ApplicationsModule, UsersModule, InterviewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
