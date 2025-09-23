import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateApplicationDto, AppStatus } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { AddStageDto } from './dto/add-stage.dto';
import { AddNoteDto } from './dto/add-note.dto';
import { AddAttachmentDto } from './dto/add-attachment.dto';
import { AddReferralDto } from './dto/add-referral.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, orgId: string, createApplicationDto: CreateApplicationDto) {
    // Verify user has access to the organization
    await this.verifyOrgAccess(userId, orgId);

    return this.prisma.application.create({
      data: {
        ...createApplicationDto,
        orgId,
        createdById: userId,
      },
    });
  }

  async findAll(userId: string, orgId: string, filters: any = {}) {
    await this.verifyOrgAccess(userId, orgId);

    const { status, company, search, ...restFilters } = filters;
    
    const where: any = { orgId, ...restFilters };
    
    if (status) {
      where.status = status;
    }
    
    if (company) {
      where.company = { contains: company, mode: 'insensitive' };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.application.findMany({
      where,
      include: {
        stages: {
          orderBy: { createdAt: 'asc' },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: { notes: true, attachments: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(userId: string, orgId: string, id: string) {
    await this.verifyOrgAccess(userId, orgId);

    const application = await this.prisma.application.findUnique({
      where: { id, orgId },
      include: {
        stages: {
          orderBy: { createdAt: 'asc' },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        contacts: {
          include: {
            contact: true,
          },
        },
        attachments: true,
        referrals: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async update(
    userId: string,
    orgId: string,
    id: string,
    updateApplicationDto: UpdateApplicationDto,
  ) {
    await this.verifyOrgAccess(userId, orgId);

    try {
      return await this.prisma.application.update({
        where: { id, orgId },
        data: updateApplicationDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Application not found');
      }
      throw error;
    }
  }

  async remove(userId: string, orgId: string, id: string) {
    await this.verifyOrgAccess(userId, orgId);

    try {
      await this.prisma.application.delete({
        where: { id, orgId },
      });
      return { message: 'Application deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Application not found');
      }
      throw error;
    }
  }

  async addStage(userId: string, orgId: string, appId: string, addStageDto: AddStageDto) {
    await this.verifyOrgAccess(userId, orgId);

    // Verify application exists and belongs to org
    await this.verifyApplicationExists(appId, orgId);

    return this.prisma.stage.create({
      data: {
        ...addStageDto,
        appId,
      },
    });
  }

  async addNote(userId: string, orgId: string, appId: string, addNoteDto: AddNoteDto) {
    await this.verifyOrgAccess(userId, orgId);
    
    // Verify application exists and belongs to org
    await this.verifyApplicationExists(appId, orgId);

    return this.prisma.note.create({
      data: {
        ...addNoteDto,
        appId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async addAttachment(
    userId: string,
    orgId: string,
    appId: string,
    addAttachmentDto: AddAttachmentDto,
    file: Express.Multer.File,
  ) {
    await this.verifyOrgAccess(userId, orgId);
    
    // Verify application exists and belongs to org
    await this.verifyApplicationExists(appId, orgId);

    // TODO: Upload file to S3 and get the key
    const fileKey = `orgs/${orgId}/applications/${appId}/${Date.now()}-${file.originalname}`;
    
    // TODO: Implement actual file upload to S3
    // await this.s3Service.uploadFile(fileKey, file.buffer, file.mimetype);

    return this.prisma.attachment.create({
      data: {
        appId,
        key: fileKey,
        mime: file.mimetype,
        size: file.size,
        name: file.originalname,
        kind: addAttachmentDto.kind,
      },
    });
  }

  async addReferral(userId: string, orgId: string, appId: string, addReferralDto: AddReferralDto) {
    await this.verifyOrgAccess(userId, orgId);
    
    // Verify application exists and belongs to org
    await this.verifyApplicationExists(appId, orgId);

    return this.prisma.referral.create({
      data: {
        appId,
        ...addReferralDto,
      },
    });
  }

  async getStats(userId: string, orgId: string) {
    await this.verifyOrgAccess(userId, orgId);

    const applications = await this.prisma.application.findMany({
      where: { orgId },
      select: {
        status: true,
        stages: true,
        createdAt: true,
      },
    });

    // Calculate funnel stats
    const funnel = {};
    Object.values(AppStatus).forEach((status) => {
      funnel[status] = applications.filter((app) => app.status === status).length;
    });

    // Calculate time to next stage
    const timeToNextStage = this.calculateTimeToNextStage(applications);

    // Calculate offers vs rejections
    const offers = applications.filter((app) => app.status === 'OFFER').length;
    const rejections = applications.filter((app) => app.status === 'REJECTED').length;

    return {
      total: applications.length,
      funnel,
      timeToNextStage,
      offersVsRejections: {
        offers,
        rejections,
        offerRate: applications.length > 0 ? (offers / applications.length) * 100 : 0,
      },
    };
  }

  private async verifyOrgAccess(userId: string, orgId: string) {
    const membership = await this.prisma.orgMember.findFirst({
      where: {
        userId,
        orgId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You do not have access to this organization');
    }
  }

  private async verifyApplicationExists(applicationId: string, orgId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId, orgId },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }
  }

  private calculateTimeToNextStage(applications: any[]) {
    // Group stages by application
    const appStages = {};
    applications.forEach((app) => {
      if (!appStages[app.id]) {
        appStages[app.id] = [];
      }
      appStages[app.id] = app.stages.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    });

    // Calculate time between stages
    const stageTimes = {};
    Object.values(appStages).forEach((stages: any[]) => {
      for (let i = 0; i < stages.length - 1; i++) {
        const currentStage = stages[i];
        const nextStage = stages[i + 1];
        const timeDiff = new Date(nextStage.createdAt).getTime() - new Date(currentStage.createdAt).getTime();
        
        if (!stageTimes[currentStage.name]) {
          stageTimes[currentStage.name] = [];
        }
        stageTimes[currentStage.name].push(timeDiff);
      }
    });

    // Calculate average time for each stage transition
    const result = {};
    Object.entries(stageTimes).forEach(([stage, times]: [string, number[]]) => {
      const sum = times.reduce((a, b) => a + b, 0);
      result[stage] = sum / times.length; // Average time in milliseconds
    });

    return result;
  }
}
