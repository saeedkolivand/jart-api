import { IsString, IsDateString, IsOptional } from 'class-validator';

export class AddStageDto {
  @IsString()
  name: string;

  @IsDateString()
  @IsOptional()
  scheduledAt?: Date;

  @IsString()
  @IsOptional()
  result?: string;
}
