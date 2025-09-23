import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
export declare class OrganizationsController {
    private readonly organizationsService;
    private readonly logger;
    constructor(organizationsService: OrganizationsService);
    create(req: any, createOrganizationDto: CreateOrganizationDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(req: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        role: import("./organizations.service").OrgRole;
    }[]>;
    findOne(req: any, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        role: import("./organizations.service").OrgRole;
    }>;
    update(req: any, id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(req: any, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    inviteMember(req: any, id: string, inviteDto: InviteMemberDto): Promise<{
        message: string;
    }>;
    getMembers(req: any, id: string): Promise<({
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
}
