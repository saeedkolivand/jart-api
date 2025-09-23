import { IsEnum, IsOptional } from 'class-validator';
import { AttachmentKind } from '@prisma/client';

export class AddAttachmentDto {
  @IsEnum(AttachmentKind)
  @IsOptional()
  kind?: AttachmentKind;
}
