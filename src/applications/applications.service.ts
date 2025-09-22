import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { ApplicationQueryDto } from "./dto/query.dto";

const prisma = new PrismaClient();

@Injectable()
export class ApplicationsService {
  create(dto: CreateApplicationDto) {
    return prisma.application.create({
      data: { title: dto.title, company: dto.company, source: dto.source },
    });
  }
  list(q: ApplicationQueryDto) {
    return prisma.application.findMany({
      where: {
        AND: [
          q.status ? { status: q.status } : {},
          q.q
            ? {
                OR: [
                  { title: { contains: q.q, mode: "insensitive" } },
                  { company: { contains: q.q, mode: "insensitive" } },
                ],
              }
            : {},
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  }
  get(id: string) {
    return prisma.application.findUnique({ where: { id } });
  }
  update(id: string, dto: UpdateApplicationDto) {
    return prisma.application.update({ where: { id }, data: dto });
  }
}
