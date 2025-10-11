import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class ResolveDisputeDto {
  @IsEnum(['RELEASE', 'REFUND'], {
    message: 'resolution must be RELEASE or REFUND',
  })
  resolution!: 'RELEASE' | 'REFUND';

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
