import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddReferralDto {
  @IsEmail()
  referrerEmail: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  rewardCents?: number;
}
