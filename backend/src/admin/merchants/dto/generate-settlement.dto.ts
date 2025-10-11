import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { SettlementMethod } from '@prisma/client';

export class GenerateSettlementDto {
  @Type(() => Date)
  @IsDate()
  periodStart!: Date;

  @Type(() => Date)
  @IsDate()
  periodEnd!: Date;

  @IsOptional()
  @IsEnum(SettlementMethod)
  method?: SettlementMethod;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
