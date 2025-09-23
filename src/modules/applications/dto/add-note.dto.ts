import { IsString, IsNotEmpty } from 'class-validator';

export class AddNoteDto {
  @IsString()
  @IsNotEmpty()
  body: string;
}
