import { Module } from "@nestjs/common";
import { InterviewsService } from "./interviews.service";
import { InterviewsController } from "./interviews.controller";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
  controllers: [InterviewsController],
  providers: [InterviewsService],
  imports: [PrismaModule],
})
export class InterviewsModule {}
