"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../shared/prisma/prisma.service");
const create_application_dto_1 = require("./dto/create-application.dto");
let ApplicationsService = class ApplicationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, orgId, createApplicationDto) {
        await this.verifyOrgAccess(userId, orgId);
        return this.prisma.application.create({
            data: Object.assign(Object.assign({}, createApplicationDto), { orgId, createdById: userId }),
        });
    }
    async findAll(userId, orgId, filters = {}) {
        await this.verifyOrgAccess(userId, orgId);
        const { status, company, search } = filters, restFilters = __rest(filters, ["status", "company", "search"]);
        const where = Object.assign({ orgId }, restFilters);
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
    async findOne(userId, orgId, id) {
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
            throw new common_1.NotFoundException('Application not found');
        }
        return application;
    }
    async update(userId, orgId, id, updateApplicationDto) {
        await this.verifyOrgAccess(userId, orgId);
        try {
            return await this.prisma.application.update({
                where: { id, orgId },
                data: updateApplicationDto,
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('Application not found');
            }
            throw error;
        }
    }
    async remove(userId, orgId, id) {
        await this.verifyOrgAccess(userId, orgId);
        try {
            await this.prisma.application.delete({
                where: { id, orgId },
            });
            return { message: 'Application deleted successfully' };
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('Application not found');
            }
            throw error;
        }
    }
    async addStage(userId, orgId, appId, addStageDto) {
        await this.verifyOrgAccess(userId, orgId);
        await this.verifyApplicationExists(appId, orgId);
        return this.prisma.stage.create({
            data: Object.assign(Object.assign({}, addStageDto), { appId }),
        });
    }
    async addNote(userId, orgId, appId, addNoteDto) {
        await this.verifyOrgAccess(userId, orgId);
        await this.verifyApplicationExists(appId, orgId);
        return this.prisma.note.create({
            data: Object.assign(Object.assign({}, addNoteDto), { appId, authorId: userId }),
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
    async addAttachment(userId, orgId, appId, addAttachmentDto, file) {
        await this.verifyOrgAccess(userId, orgId);
        await this.verifyApplicationExists(appId, orgId);
        const fileKey = `orgs/${orgId}/applications/${appId}/${Date.now()}-${file.originalname}`;
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
    async addReferral(userId, orgId, appId, addReferralDto) {
        await this.verifyOrgAccess(userId, orgId);
        await this.verifyApplicationExists(appId, orgId);
        return this.prisma.referral.create({
            data: Object.assign({ appId }, addReferralDto),
        });
    }
    async getStats(userId, orgId) {
        await this.verifyOrgAccess(userId, orgId);
        const applications = await this.prisma.application.findMany({
            where: { orgId },
            select: {
                status: true,
                stages: true,
                createdAt: true,
            },
        });
        const funnel = {};
        Object.values(create_application_dto_1.AppStatus).forEach((status) => {
            funnel[status] = applications.filter((app) => app.status === status).length;
        });
        const timeToNextStage = this.calculateTimeToNextStage(applications);
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
    async verifyOrgAccess(userId, orgId) {
        const membership = await this.prisma.orgMember.findFirst({
            where: {
                userId,
                orgId,
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('You do not have access to this organization');
        }
    }
    async verifyApplicationExists(applicationId, orgId) {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId, orgId },
        });
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
        }
    }
    calculateTimeToNextStage(applications) {
        const appStages = {};
        applications.forEach((app) => {
            if (!appStages[app.id]) {
                appStages[app.id] = [];
            }
            appStages[app.id] = app.stages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        });
        const stageTimes = {};
        Object.values(appStages).forEach((stages) => {
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
        const result = {};
        Object.entries(stageTimes).forEach(([stage, times]) => {
            const sum = times.reduce((a, b) => a + b, 0);
            result[stage] = sum / times.length;
        });
        return result;
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map