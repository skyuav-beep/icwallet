import { Controller, Get, Query, UseGuards, Version } from '@nestjs/common';
import { AdminPolicyService } from './admin-policy.service';
import { PaginationQueryDto } from '../dto/pagination.dto';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { AdminRolesGuard } from '../guards/admin-roles.guard';
import { AdminRoles } from '../decorators/admin-roles.decorator';

@Controller('admin/policies')
@UseGuards(AdminAuthGuard, AdminRolesGuard)
@AdminRoles('Super Admin', 'Compliance Officer')
export class AdminPolicyController {
  constructor(private readonly policyService: AdminPolicyService) {}

  @Get('roles')
  @Version('1')
  listRoles() {
    return this.policyService.listRoles();
  }

  @Get('permissions')
  @Version('1')
  listPermissions() {
    return this.policyService.listPermissions();
  }

  @Get('audit-logs')
  @Version('1')
  listAuditLogs(@Query() query: PaginationQueryDto) {
    return this.policyService.listAuditLogs(query);
  }
}
