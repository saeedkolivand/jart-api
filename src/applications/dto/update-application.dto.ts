import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateApplicationDto } from './create-application.dto';
import { AppStatus } from '@prisma/client';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  @ApiProperty({
    example: 'Senior Backend Developer',
    description: 'The job title for the application',
    required: false,
  })
  title?: string;

  @ApiProperty({
    example: 'Tech Corp Inc.',
    description: 'The name of the company',
    required: false,
  })
  company?: string;

  @ApiProperty({
    example: 'cl5r8y3u0000y2r5m9w1q2w3e',
    description: 'The ID of the user who owns this application',
    required: false,
  })
  userId?: string;

  @ApiProperty({
    enum: AppStatus,
    enumName: 'AppStatus',
    example: AppStatus.INTERVIEW,
    description: 'The current status of the application',
    required: false,
  })
  status?: AppStatus;
}
