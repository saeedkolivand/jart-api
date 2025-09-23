import { Injectable, ForbiddenException, NotFoundException, Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '@shared/prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InviteMemberDto } from './dto/invite-member.dto';

// Define Role enum to match Prisma's generated enum
export enum OrgRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

// Define a custom type for the transaction client
type TransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use">;

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrganizationDto: CreateOrganizationDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Type assertion to handle the transaction client
        const tx = prisma as unknown as TransactionClient;
        
        const organization = await tx.organization.create({
          data: {
            name: createOrganizationDto.name,
          },
        });

        // Add the creator as an owner
        await tx.orgMember.create({
          data: {
            orgId: organization.id,
            userId: userId,
            role: OrgRole.OWNER as any, // Type assertion to handle enum
          },
        });

        return organization;
      });
    } catch (error) {
      this.logger.error('Error creating organization', error);
      throw error;
    }
  }

  async findAll(userId: string) {
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
        role: membership.role as OrgRole,
      }));
    } catch (error) {
      this.logger.error('Error finding organizations', error);
      throw error;
    }
  }

  async findOne(userId: string, id: string) {
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
        throw new NotFoundException('Organization not found or you do not have access');
      }

      return {
        id: membership.org.id,
        name: membership.org.name,
        createdAt: membership.org.createdAt,
        updatedAt: membership.org.updatedAt,
        role: membership.role as OrgRole,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Error finding organization', error);
      throw new Error('Failed to find organization');
    }
  }

  async update(userId: string, id: string, updateOrganizationDto: UpdateOrganizationDto) {
    await this.verifyUserRole(userId, id, [OrgRole.OWNER, OrgRole.ADMIN]);

    return this.prisma.organization.update({
      where: { id },
      data: updateOrganizationDto,
    });
  }

  async remove(userId: string, id: string) {
    await this.verifyUserRole(userId, id, [OrgRole.OWNER]);

    return this.prisma.organization.delete({
      where: { id },
    });
  }

  async inviteMember(userId: string, orgId: string, inviteDto: InviteMemberDto) {
    try {
      await this.verifyUserRole(userId, orgId, [OrgRole.OWNER, OrgRole.ADMIN]);

      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { email: inviteDto.email },
      });

      if (!user) {
        // TODO: Send invitation email
        return { message: 'Invitation sent to user email' };
      }

      // Check if user is already a member
      const existingMember = await this.prisma.orgMember.findFirst({
        where: {
          userId: user.id,
          orgId,
        },
      });

      if (existingMember) {
        throw new ForbiddenException('User is already a member of this organization');
      }

      // Validate the role
      const role = inviteDto.role || OrgRole.MEMBER;
      if (!Object.values(OrgRole).includes(role as OrgRole)) {
        throw new ForbiddenException('Invalid role specified');
      }

      // Add user to organization
      await this.prisma.orgMember.create({
        data: {
          orgId,
          userId: user.id,
          role: role as any, // Type assertion to handle enum
        },
      });

      return { message: 'User added to organization' };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error('Error inviting member', error);
      throw new Error('Failed to invite member');
    }
  }

  async getMembers(userId: string, orgId: string) {
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

  private async verifyUserRole(userId: string, orgId: string, allowedRoles: OrgRole[]) {
    try {
      const membership = await this.prisma.orgMember.findFirst({
        where: {
          userId,
          orgId,
        },
      });

      if (!membership) {
        throw new ForbiddenException('You are not a member of this organization');
      }

      // Convert role to string for comparison if it's an enum
      const userRole = membership.role as unknown as string;
      const hasPermission = allowedRoles.some(role => role === userRole);
      
      if (!hasPermission) {
        throw new ForbiddenException('You do not have permission to perform this action');
      }

      return membership;
    } catch (error) {
      this.logger.error('Error verifying user role', error);
      throw error;
    }
  }
}
