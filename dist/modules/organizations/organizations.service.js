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
var OrganizationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationsService = exports.OrgRole = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../shared/prisma/prisma.service");
var OrgRole;
(function (OrgRole) {
    OrgRole["OWNER"] = "OWNER";
    OrgRole["ADMIN"] = "ADMIN";
    OrgRole["MEMBER"] = "MEMBER";
})(OrgRole || (exports.OrgRole = OrgRole = {}));
let OrganizationsService = OrganizationsService_1 = class OrganizationsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(OrganizationsService_1.name);
    }
    async create(userId, createOrganizationDto) {
        try {
            return await this.prisma.$transaction(async (prisma) => {
                const tx = prisma;
                const organization = await tx.organization.create({
                    data: {
                        name: createOrganizationDto.name,
                    },
                });
                await tx.orgMember.create({
                    data: {
                        orgId: organization.id,
                        userId: userId,
                        role: OrgRole.OWNER,
                    },
                });
                return organization;
            });
        }
        catch (error) {
            this.logger.error('Error creating organization', error);
            throw error;
        }
    }
    async findAll(userId) {
        try {
            const memberships = await this.prisma.orgMember.findMany({
                where: { userId },
                include: {
                    org: true,
                },
            });
            return memberships.map(membership => ({
                id: membership.org.id,
                name: membership.org.name,
                createdAt: membership.org.createdAt,
                updatedAt: membership.org.updatedAt,
                role: membership.role,
            }));
        }
        catch (error) {
            this.logger.error('Error finding organizations', error);
            throw error;
        }
    }
    async findOne(userId, id) {
        try {
            const membership = await this.prisma.orgMember.findFirst({
                where: {
                    userId,
                    orgId: id,
                },
                include: {
                    org: {
                        select: {
                            id: true,
                            name: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
            });
            if (!membership || !membership.org) {
                throw new common_1.NotFoundException('Organization not found or you do not have access');
            }
            return {
                id: membership.org.id,
                name: membership.org.name,
                createdAt: membership.org.createdAt,
                updatedAt: membership.org.updatedAt,
                role: membership.role,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error('Error finding organization', error);
            throw new Error('Failed to find organization');
        }
    }
    async update(userId, id, updateOrganizationDto) {
        await this.verifyUserRole(userId, id, [OrgRole.OWNER, OrgRole.ADMIN]);
        return this.prisma.organization.update({
            where: { id },
            data: updateOrganizationDto,
        });
    }
    async remove(userId, id) {
        await this.verifyUserRole(userId, id, [OrgRole.OWNER]);
        return this.prisma.organization.delete({
            where: { id },
        });
    }
    async inviteMember(userId, orgId, inviteDto) {
        try {
            await this.verifyUserRole(userId, orgId, [OrgRole.OWNER, OrgRole.ADMIN]);
            const user = await this.prisma.user.findUnique({
                where: { email: inviteDto.email },
            });
            if (!user) {
                return { message: 'Invitation sent to user email' };
            }
            const existingMember = await this.prisma.orgMember.findFirst({
                where: {
                    userId: user.id,
                    orgId,
                },
            });
            if (existingMember) {
                throw new common_1.ForbiddenException('User is already a member of this organization');
            }
            const role = inviteDto.role || OrgRole.MEMBER;
            if (!Object.values(OrgRole).includes(role)) {
                throw new common_1.ForbiddenException('Invalid role specified');
            }
            await this.prisma.orgMember.create({
                data: {
                    orgId,
                    userId: user.id,
                    role: role,
                },
            });
            return { message: 'User added to organization' };
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            this.logger.error('Error inviting member', error);
            throw new Error('Failed to invite member');
        }
    }
    async getMembers(userId, orgId) {
        await this.verifyUserRole(userId, orgId, [OrgRole.OWNER, OrgRole.ADMIN, OrgRole.MEMBER]);
        return this.prisma.orgMember.findMany({
            where: { orgId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    async verifyUserRole(userId, orgId, allowedRoles) {
        try {
            const membership = await this.prisma.orgMember.findFirst({
                where: {
                    userId,
                    orgId,
                },
            });
            if (!membership) {
                throw new common_1.ForbiddenException('You are not a member of this organization');
            }
            const userRole = membership.role;
            const hasPermission = allowedRoles.some(role => role === userRole);
            if (!hasPermission) {
                throw new common_1.ForbiddenException('You do not have permission to perform this action');
            }
            return membership;
        }
        catch (error) {
            this.logger.error('Error verifying user role', error);
            throw error;
        }
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = OrganizationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map