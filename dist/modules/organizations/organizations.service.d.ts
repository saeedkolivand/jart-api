import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
export declare enum OrgRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    MEMBER = "MEMBER"
}
export declare class OrganizationsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(userId: string, createOrganizationDto: CreateOrganizationDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        role: OrgRole;
    }[]>;
    findOne(userId: string, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        role: OrgRole;
    }>;
    update(userId: string, id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(userId: string, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    inviteMember(userId: string, orgId: string, inviteDto: InviteMemberDto): Promise<{
        message: string;
    }>;
    getMembers(userId: string, orgId: string): Promise<({
        user: {
            email: string;
            id: string;
            name: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orgId: string;
        userId: string;
        role: import(".prisma/client").$Enums.Role;
    })[]>;
    private verifyUserRole;
}
