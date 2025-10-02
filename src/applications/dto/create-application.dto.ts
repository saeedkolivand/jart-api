import { IsString, IsEnum, IsOptional, IsNotEmpty } from "class-validator";
import { AppStatus } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class CreateApplicationDto {
  @ApiProperty({
    example: "Senior Backend Developer",
    description: "The job title for the application",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: "Tech Corp Inc.",
    description: "The name of the company",
  })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({
    example: "cl5r8y3u0000y2r5m9w1q2w3e",
    description: "The ID of the user who owns this application",
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    enum: AppStatus,
    enumName: "AppStatus",
    example: AppStatus.APPLIED,
    description: "The current status of the application",
    required: false,
  })
  @IsOptional()
  @IsEnum(AppStatus)
  status?: AppStatus;
}
