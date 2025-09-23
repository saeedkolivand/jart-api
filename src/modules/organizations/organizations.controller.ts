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
  HttpStatus, 
  HttpException,
  Logger
} from '@nestjs/common';
import { 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse, 
  ApiTags, 
  ApiParam 
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InviteMemberDto } from './dto/invite-member.dto';

@ApiTags('organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrganizationsController {
  private readonly logger = new Logger(OrganizationsController.name);

  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Organization created successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Bad request' 
  })
  @ApiResponse({ 
    status: HttpStatus.INTERNAL_SERVER_ERROR, 
    description: 'Internal server error' 
  })
  async create(
    @Request() req: any, 
    @Body() createOrganizationDto: CreateOrganizationDto
  ) {
    try {
      return await this.organizationsService.create(
        req.user.userId, 
        createOrganizationDto
      );
    } catch (error) {
      this.logger.error('Error creating organization', error);
      throw new HttpException(
        'Failed to create organization', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations for the current user' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return all organizations' 
  })
  @ApiResponse({ 
    status: HttpStatus.INTERNAL_SERVER_ERROR, 
    description: 'Internal server error' 
  })
  async findAll(@Request() req: any) {
    try {
      return await this.organizationsService.findAll(req.user.userId);
    } catch (error) {
      this.logger.error('Error finding organizations', error);
      throw new HttpException(
        'Failed to retrieve organizations', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Organization ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return organization by ID' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Forbidden' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Organization not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.INTERNAL_SERVER_ERROR, 
    description: 'Internal server error' 
  })
  async findOne(
    @Request() req: any, 
    @Param('id') id: string
  ) {
    try {
      return await this.organizationsService.findOne(req.user.userId, id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error finding organization with ID ${id}`, error);
      throw new HttpException(
        'Failed to retrieve organization', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update organization' })
  @ApiResponse({ status: 200, description: 'Organization updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(req.user.userId, id, updateOrganizationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete organization' })
  @ApiResponse({ status: 200, description: 'Organization deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Request() req, @Param('id') id: string) {
    return this.organizationsService.remove(req.user.userId, id);
  }

  @Post(':id/invite')
  @ApiOperation({ summary: 'Invite a member to the organization' })
  @ApiResponse({ status: 201, description: 'Invitation sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  inviteMember(
    @Request() req,
    @Param('id') id: string,
    @Body() inviteDto: InviteMemberDto,
  ) {
    return this.organizationsService.inviteMember(req.user.userId, id, inviteDto);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get all members of an organization' })
  @ApiResponse({ status: 200, description: 'Return all members' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getMembers(@Request() req, @Param('id') id: string) {
    return this.organizationsService.getMembers(req.user.userId, id);
  }
}
