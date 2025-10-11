import { IsDateString, IsString, MaxLength } from 'class-validator';

export class PublishTermsDto {
  @IsString()
  @MaxLength(50)
  type!: string;

  @IsString()
  @MaxLength(20)
  version!: string;

  @IsString()
  content!: string;

  @IsDateString()
  effectiveAt!: string;
}
