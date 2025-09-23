import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { AddStageDto } from './dto/add-stage.dto';
import { AddNoteDto } from './dto/add-note.dto';
import { AddAttachmentDto } from './dto/add-attachment.dto';
import { AddReferralDto } from './dto/add-referral.dto';

@ApiTags('applications')
@Controller('organizations/:orgId/applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new job application' })
  @ApiResponse({ status: 201, description: 'Application created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @Request() req,
    @Param('orgId') orgId: string,
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    return this.applicationsService.create(req.user.userId, orgId, createApplicationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all applications for an organization' })
  @ApiResponse({ status: 200, description: 'Return all applications' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll(
    @Request() req,
    @Param('orgId') orgId: string,
    @Query('status') status?: string,
    @Query('company') company?: string,
    @Query('search') search?: string,
  ) {
    return this.applicationsService.findAll(req.user.userId, orgId, {
      status,
      company,
      search,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get application statistics' })
  @ApiResponse({ status: 200, description: 'Return application statistics' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getStats(@Request() req, @Param('orgId') orgId: string) {
    return this.applicationsService.getStats(req.user.userId, orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application by ID' })
  @ApiResponse({ status: 200, description: 'Return application by ID' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  findOne(
    @Request() req,
    @Param('orgId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.applicationsService.findOne(req.user.userId, orgId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update application' })
  @ApiResponse({ status: 200, description: 'Application updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  update(
    @Request() req,
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationsService.update(req.user.userId, orgId, id, updateApplicationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete application' })
  @ApiResponse({ status: 200, description: 'Application deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  remove(
    @Request() req,
    @Param('orgId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.applicationsService.remove(req.user.userId, orgId, id);
  }

  @Post(':id/stages')
  @ApiOperation({ summary: 'Add a stage to an application' })
  @ApiResponse({ status: 201, description: 'Stage added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  addStage(
    @Request() req,
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @Body() addStageDto: AddStageDto,
  ) {
    return this.applicationsService.addStage(req.user.userId, orgId, id, addStageDto);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add a note to an application' })
  @ApiResponse({ status: 201, description: 'Note added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  addNote(
    @Request() req,
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @Body() addNoteDto: AddNoteDto,
  ) {
    return this.applicationsService.addNote(req.user.userId, orgId, id, addNoteDto);
  }

  @Post(':id/attachments')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  })
  @ApiOperation({ summary: 'Add an attachment to an application' })
  @ApiResponse({ status: 201, description: 'Attachment added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async addAttachment(
    @Request() req,
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf|doc|docx)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() addAttachmentDto: AddAttachmentDto,
  ) {
    return this.applicationsService.addAttachment(
      req.user.userId,
      orgId,
      id,
      addAttachmentDto,
      file,
    );
  }

  @Post(':id/referrals')
  @ApiOperation({ summary: 'Add a referral to an application' })
  @ApiResponse({ status: 201, description: 'Referral added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  addReferral(
    @Request() req,
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @Body() addReferralDto: AddReferralDto,
  ) {
    return this.applicationsService.addReferral(req.user.userId, orgId, id, addReferralDto);
  }
}
