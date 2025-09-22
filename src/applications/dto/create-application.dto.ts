import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateApplicationDto {
  @ApiProperty() @IsString() title!: string;
  @ApiProperty() @IsString() company!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() source?: string; // LinkedIn, Referral
}
