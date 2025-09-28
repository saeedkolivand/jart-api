import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { NotesModule } from './notes/notes.module';
import { InterviewsModule } from './interviews/interviews.module';

@Module({
  imports: [PrismaModule, JobsModule, ApplicationsModule, UsersModule, CompaniesModule, NotesModule, InterviewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
