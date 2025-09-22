import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApplicationsService } from "./applications.service";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { ApplicationQueryDto } from "./dto/query.dto";

@ApiTags("applications")
@ApiBearerAuth()
@Controller("applications")
export class ApplicationsController {
  constructor(private readonly svc: ApplicationsService) {}

  @Get() list(@Query() q: ApplicationQueryDto) {
    return this.svc.list(q);
  }
  @Get(":id") get(@Param("id") id: string) {
    return this.svc.get(id);
  }
  @Post() create(@Body() dto: CreateApplicationDto) {
    return this.svc.create(dto);
  }
  @Patch(":id") update(
    @Param("id") id: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.svc.update(id, dto);
  }
}
