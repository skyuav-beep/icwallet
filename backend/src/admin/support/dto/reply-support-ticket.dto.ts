import { IsString, MaxLength } from 'class-validator';

export class ReplySupportTicketDto {
  @IsString()
  @MaxLength(2000)
  note!: string;
}
