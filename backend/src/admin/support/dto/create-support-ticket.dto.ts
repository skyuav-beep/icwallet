import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSupportTicketDto {
  @IsOptional()
  @IsString()
  memberId?: string;

  @IsString()
  @MaxLength(120)
  category!: string;

  @IsString()
  @MaxLength(2000)
  content!: string;
}
