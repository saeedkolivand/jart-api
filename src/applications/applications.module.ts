import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  imports: [PrismaModule],
})
export class ApplicationsModule {}
