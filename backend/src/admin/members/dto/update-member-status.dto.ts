import { IsEnum, IsOptional } from 'class-validator';
import { MemberKycStatus, MemberStatus } from '@prisma/client';

export class UpdateMemberStatusDto {
  @IsEnum(MemberStatus)
  status!: MemberStatus;

  @IsOptional()
  @IsEnum(MemberKycStatus)
  kycStatus?: MemberKycStatus;
}
