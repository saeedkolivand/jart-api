import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { AddStageDto } from './dto/add-stage.dto';
import { AddNoteDto } from './dto/add-note.dto';
import { AddAttachmentDto } from './dto/add-attachment.dto';
import { AddReferralDto } from './dto/add-referral.dto';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    create(req: any, orgId: string, createApplicationDto: CreateApplicationDto): Promise<{
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
    findAll(req: any, orgId: string, status?: string, company?: string, search?: string): Promise<({
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
    getStats(req: any, orgId: string): Promise<{
        total: number;
        funnel: {};
        timeToNextStage: {};
        offersVsRejections: {
            offers: number;
            rejections: number;
            offerRate: number;
        };
    }>;
    findOne(req: any, orgId: string, id: string): Promise<{
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
                links: import("@prisma/client/runtime/library").JsonValue | null;
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
    update(req: any, orgId: string, id: string, updateApplicationDto: UpdateApplicationDto): Promise<{
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
    remove(req: any, orgId: string, id: string): Promise<{
        message: string;
    }>;
    addStage(req: any, orgId: string, id: string, addStageDto: AddStageDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        result: string | null;
        scheduledAt: Date | null;
        appId: string;
    }>;
    addNote(req: any, orgId: string, id: string, addNoteDto: AddNoteDto): Promise<{
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
    addAttachment(req: any, orgId: string, id: string, file: Express.Multer.File, addAttachmentDto: AddAttachmentDto): Promise<{
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
    addReferral(req: any, orgId: string, id: string, addReferralDto: AddReferralDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        referrerEmail: string;
        rewardCents: number | null;
        appId: string;
    }>;
}
