import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { AddStageDto } from './dto/add-stage.dto';
import { AddNoteDto } from './dto/add-note.dto';
import { AddAttachmentDto } from './dto/add-attachment.dto';
import { AddReferralDto } from './dto/add-referral.dto';
import { Prisma } from '@prisma/client';
export declare class ApplicationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, orgId: string, createApplicationDto: CreateApplicationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        company: string;
        location: string | null;
        source: string | null;
        status: import(".prisma/client").$Enums.AppStatus;
        salaryMin: number | null;
        salaryMax: number | null;
        jobPostingUrl: string | null;
        orgId: string;
        createdById: string;
    }>;
    findAll(userId: string, orgId: string, filters?: any): Promise<({
        notes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            appId: string;
            authorId: string;
        }[];
        _count: {
            notes: number;
            attachments: number;
        };
        stages: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            result: string | null;
            scheduledAt: Date | null;
            appId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        company: string;
        location: string | null;
        source: string | null;
        status: import(".prisma/client").$Enums.AppStatus;
        salaryMin: number | null;
        salaryMax: number | null;
        jobPostingUrl: string | null;
        orgId: string;
        createdById: string;
    })[]>;
    findOne(userId: string, orgId: string, id: string): Promise<{
        notes: ({
            author: {
                email: string;
                id: string;
                name: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            appId: string;
            authorId: string;
        })[];
        stages: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            result: string | null;
            scheduledAt: Date | null;
            appId: string;
        }[];
        contacts: ({
            contact: {
                email: string | null;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                links: Prisma.JsonValue | null;
                title: string | null;
                company: string | null;
                phone: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            appId: string;
            contactId: string;
        })[];
        attachments: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            kind: import(".prisma/client").$Enums.AttachmentKind;
            appId: string;
            key: string;
            mime: string;
            size: number;
        }[];
        referrals: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            referrerEmail: string;
            rewardCents: number | null;
            appId: string;
        }[];
        createdBy: {
            email: string;
            id: string;
            name: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        company: string;
        location: string | null;
        source: string | null;
        status: import(".prisma/client").$Enums.AppStatus;
        salaryMin: number | null;
        salaryMax: number | null;
        jobPostingUrl: string | null;
        orgId: string;
        createdById: string;
    }>;
    update(userId: string, orgId: string, id: string, updateApplicationDto: UpdateApplicationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        company: string;
        location: string | null;
        source: string | null;
        status: import(".prisma/client").$Enums.AppStatus;
        salaryMin: number | null;
        salaryMax: number | null;
        jobPostingUrl: string | null;
        orgId: string;
        createdById: string;
    }>;
    remove(userId: string, orgId: string, id: string): Promise<{
        message: string;
    }>;
    addStage(userId: string, orgId: string, appId: string, addStageDto: AddStageDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        result: string | null;
        scheduledAt: Date | null;
        appId: string;
    }>;
    addNote(userId: string, orgId: string, appId: string, addNoteDto: AddNoteDto): Promise<{
        author: {
            email: string;
            id: string;
            name: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        body: string;
        appId: string;
        authorId: string;
    }>;
    addAttachment(userId: string, orgId: string, appId: string, addAttachmentDto: AddAttachmentDto, file: Express.Multer.File): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        kind: import(".prisma/client").$Enums.AttachmentKind;
        appId: string;
        key: string;
        mime: string;
        size: number;
    }>;
    addReferral(userId: string, orgId: string, appId: string, addReferralDto: AddReferralDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        referrerEmail: string;
        rewardCents: number | null;
        appId: string;
    }>;
    getStats(userId: string, orgId: string): Promise<{
        total: number;
        funnel: {};
        timeToNextStage: {};
        offersVsRejections: {
            offers: number;
            rejections: number;
            offerRate: number;
        };
    }>;
    private verifyOrgAccess;
    private verifyApplicationExists;
    private calculateTimeToNextStage;
}
