import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateApplicationDto) {
    return this.prisma.application.create({ data: dto });
  }

  findAll() {
    return this.prisma.application.findMany();
  }

  findOne(id: string) {
    return this.prisma.application.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateApplicationDto) {
    return this.prisma.application.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.application.delete({ where: { id } });
  }
}
