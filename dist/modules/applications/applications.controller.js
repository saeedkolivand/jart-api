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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const applications_service_1 = require("./applications.service");
const create_application_dto_1 = require("./dto/create-application.dto");
const update_application_dto_1 = require("./dto/update-application.dto");
const add_stage_dto_1 = require("./dto/add-stage.dto");
const add_note_dto_1 = require("./dto/add-note.dto");
const add_attachment_dto_1 = require("./dto/add-attachment.dto");
const add_referral_dto_1 = require("./dto/add-referral.dto");
let ApplicationsController = class ApplicationsController {
    constructor(applicationsService) {
        this.applicationsService = applicationsService;
    }
    create(req, orgId, createApplicationDto) {
        return this.applicationsService.create(req.user.userId, orgId, createApplicationDto);
    }
    findAll(req, orgId, status, company, search) {
        return this.applicationsService.findAll(req.user.userId, orgId, {
            status,
            company,
            search,
        });
    }
    getStats(req, orgId) {
        return this.applicationsService.getStats(req.user.userId, orgId);
    }
    findOne(req, orgId, id) {
        return this.applicationsService.findOne(req.user.userId, orgId, id);
    }
    update(req, orgId, id, updateApplicationDto) {
        return this.applicationsService.update(req.user.userId, orgId, id, updateApplicationDto);
    }
    remove(req, orgId, id) {
        return this.applicationsService.remove(req.user.userId, orgId, id);
    }
    addStage(req, orgId, id, addStageDto) {
        return this.applicationsService.addStage(req.user.userId, orgId, id, addStageDto);
    }
    addNote(req, orgId, id, addNoteDto) {
        return this.applicationsService.addNote(req.user.userId, orgId, id, addNoteDto);
    }
    async addAttachment(req, orgId, id, file, addAttachmentDto) {
        return this.applicationsService.addAttachment(req.user.userId, orgId, id, addAttachmentDto, file);
    }
    addReferral(req, orgId, id, addReferralDto) {
        return this.applicationsService.addReferral(req.user.userId, orgId, id, addReferralDto);
    }
};
exports.ApplicationsController = ApplicationsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new job application' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Application created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('orgId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_application_dto_1.CreateApplicationDto]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all applications for an organization' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all applications' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('orgId')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('company')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get application statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return application statistics' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('orgId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get application by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return application by ID' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('orgId')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update application' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('orgId')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, update_application_dto_1.UpdateApplicationDto]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete application' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('orgId')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/stages'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a stage to an application' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Stage added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('orgId')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, add_stage_dto_1.AddStageDto]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "addStage", null);
__decorate([
    (0, common_1.Post)(':id/notes'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a note to an application' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Note added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('orgId')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, add_note_dto_1.AddNoteDto]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "addNote", null);
__decorate([
    (0, common_1.Post)(':id/attachments'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                kind: {
                    type: 'string',
                    enum: Object.values(['RESUME', 'COVER_LETTER', 'OFFER', 'OTHER']),
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Add an attachment to an application' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Attachment added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('orgId')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
            new common_1.FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf|doc|docx)$/ }),
        ],
    }))),
    __param(4, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object, add_attachment_dto_1.AddAttachmentDto]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "addAttachment", null);
__decorate([
    (0, common_1.Post)(':id/referrals'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a referral to an application' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Referral added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('orgId')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, add_referral_dto_1.AddReferralDto]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "addReferral", null);
exports.ApplicationsController = ApplicationsController = __decorate([
    (0, swagger_1.ApiTags)('applications'),
    (0, common_1.Controller)('organizations/:orgId/applications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [applications_service_1.ApplicationsService])
], ApplicationsController);
//# sourceMappingURL=applications.controller.js.map