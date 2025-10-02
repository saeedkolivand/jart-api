import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { InterviewsService } from "@/interviews/interviews.service.js";
import { CreateInterviewDto } from "@/interviews/dto/create-interview.dto.js";
import { UpdateInterviewDto } from "@/interviews/dto/update-interview.dto.js";

@Controller("interviews")
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  create(@Body() createInterviewDto: CreateInterviewDto) {
    return this.interviewsService.create(createInterviewDto);
  }

  @Get()
  findAll() {
    return this.interviewsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.interviewsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateInterviewDto: UpdateInterviewDto) {
    return this.interviewsService.update(+id, updateInterviewDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.interviewsService.remove(+id);
  }
}
