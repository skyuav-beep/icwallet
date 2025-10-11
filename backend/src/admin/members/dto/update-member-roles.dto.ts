import { ArrayUnique, IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMemberRolesDto {
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  roleIds?: string[];
}
