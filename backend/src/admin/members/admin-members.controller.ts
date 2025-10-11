import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Query,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AdminMembersService } from './admin-members.service';
import { PaginationQueryDto } from '../dto/pagination.dto';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { AdminRolesGuard } from '../guards/admin-roles.guard';
import { AdminRoles } from '../decorators/admin-roles.decorator';
import { MemberSearchQueryDto } from './dto/member-search-query.dto';
import { UpdateMemberStatusDto } from './dto/update-member-status.dto';
import { UpdateMemberRolesDto } from './dto/update-member-roles.dto';
import { AdminRequest } from '../guards/admin-auth.guard';

@Controller('admin/members')
@UseGuards(AdminAuthGuard, AdminRolesGuard)
@AdminRoles('Super Admin', 'Operations Admin', 'Support Agent', 'Compliance Officer')
export class AdminMembersController {
  constructor(private readonly membersService: AdminMembersService) {}

  @Get()
  @Version('1')
  listMembers(@Query() query: PaginationQueryDto) {
    return this.membersService.listMembers(query);
  }

  @Get('search')
  @Version('1')
  searchMembers(@Query() query: MemberSearchQueryDto) {
    return this.membersService.searchMembers(query);
  }

  @Get(':memberId')
  @Version('1')
  getMember(@Param('memberId') memberId: string) {
    return this.membersService.getMemberById(memberId);
  }

  @Patch(':memberId/status')
  @Version('1')
  @AdminRoles('Super Admin', 'Operations Admin', 'Compliance Officer')
  updateMemberStatus(
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberStatusDto,
  ) {
    return this.membersService.updateMemberStatus(memberId, dto);
  }

  @Put(':memberId/roles')
  @Version('1')
  @AdminRoles('Super Admin', 'Operations Admin')
  updateMemberRoles(
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberRolesDto,
    @Req() request: AdminRequest,
  ) {
    return this.membersService.updateMemberRoles(
      memberId,
      dto,
      request.admin?.id ?? 'admin',
    );
  }
}
