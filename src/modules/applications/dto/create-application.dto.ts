import { IsString, IsOptional, IsEnum, IsNumber, IsUrl } from 'class-validator';

export enum AppStatus {
  APPLIED = 'APPLIED',
  HR = 'HR',
  INTERVIEW = 'INTERVIEW',
  TECH = 'TECH',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  HIRED = 'HIRED'
}

export class CreateApplicationDto {
  @IsString()
  title: string;

  @IsString()
  company: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsEnum(AppStatus)
  @IsOptional()
  status?: AppStatus;

  @IsNumber()
  @IsOptional()
  salaryMin?: number;

  @IsNumber()
  @IsOptional()
  salaryMax?: number;

  @IsUrl()
  @IsOptional()
  jobPostingUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
