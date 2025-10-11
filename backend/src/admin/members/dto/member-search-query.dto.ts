import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { MemberKycStatus, MemberStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../dto/pagination.dto';

export class MemberSearchQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  keyword?: string;

  @IsOptional()
  @IsEnum(MemberStatus)
  status?: MemberStatus;

  @IsOptional()
  @IsEnum(MemberKycStatus)
  kycStatus?: MemberKycStatus;
}
