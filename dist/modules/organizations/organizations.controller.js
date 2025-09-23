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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OrganizationsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const organizations_service_1 = require("./organizations.service");
const create_organization_dto_1 = require("./dto/create-organization.dto");
const update_organization_dto_1 = require("./dto/update-organization.dto");
const invite_member_dto_1 = require("./dto/invite-member.dto");
let OrganizationsController = OrganizationsController_1 = class OrganizationsController {
    constructor(organizationsService) {
        this.organizationsService = organizationsService;
        this.logger = new common_1.Logger(OrganizationsController_1.name);
    }
    async create(req, createOrganizationDto) {
        try {
            return await this.organizationsService.create(req.user.userId, createOrganizationDto);
        }
        catch (error) {
            this.logger.error('Error creating organization', error);
            throw new common_1.HttpException('Failed to create organization', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll(req) {
        try {
            return await this.organizationsService.findAll(req.user.userId);
        }
        catch (error) {
            this.logger.error('Error finding organizations', error);
            throw new common_1.HttpException('Failed to retrieve organizations', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(req, id) {
        try {
            return await this.organizationsService.findOne(req.user.userId, id);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error(`Error finding organization with ID ${id}`, error);
            throw new common_1.HttpException('Failed to retrieve organization', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    update(req, id, updateOrganizationDto) {
        return this.organizationsService.update(req.user.userId, id, updateOrganizationDto);
    }
    remove(req, id) {
        return this.organizationsService.remove(req.user.userId, id);
    }
    inviteMember(req, id, inviteDto) {
        return this.organizationsService.inviteMember(req.user.userId, id, inviteDto);
    }
    getMembers(req, id) {
        return this.organizationsService.getMembers(req.user.userId, id);
    }
};
exports.OrganizationsController = OrganizationsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new organization' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Organization created successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Bad request'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_organization_dto_1.CreateOrganizationDto]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all organizations for the current user' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Return all organizations'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error'
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get organization by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, description: 'Organization ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Return organization by ID'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Forbidden'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Organization not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update organization' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Organization updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_organization_dto_1.UpdateOrganizationDto]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete organization' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Organization deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/invite'),
    (0, swagger_1.ApiOperation)({ summary: 'Invite a member to the organization' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Invitation sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, invite_member_dto_1.InviteMemberDto]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "inviteMember", null);
__decorate([
    (0, common_1.Get)(':id/members'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all members of an organization' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all members' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "getMembers", null);
exports.OrganizationsController = OrganizationsController = OrganizationsController_1 = __decorate([
    (0, swagger_1.ApiTags)('organizations'),
    (0, common_1.Controller)('organizations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [organizations_service_1.OrganizationsService])
], OrganizationsController);
//# sourceMappingURL=organizations.controller.js.map