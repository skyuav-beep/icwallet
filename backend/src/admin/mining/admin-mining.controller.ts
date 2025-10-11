import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AdminMiningService } from './admin-mining.service';
import { PaginationQueryDto } from '../dto/pagination.dto';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { AdminRolesGuard } from '../guards/admin-roles.guard';
import { AdminRoles } from '../decorators/admin-roles.decorator';
import { ApprovalActionDto } from '../dto/approval-action.dto';
import type { AdminRequest } from '../guards/admin-auth.guard';

@Controller('admin/mining')
@UseGuards(AdminAuthGuard, AdminRolesGuard)
@AdminRoles('Super Admin', 'Finance Admin', 'Operations Admin', 'Compliance Officer')
export class AdminMiningController {
  constructor(private readonly miningService: AdminMiningService) {}

  @Get('withdrawals')
  @Version('1')
  listWithdrawals(@Query() query: PaginationQueryDto) {
    return this.miningService.listWithdrawalRequests(query);
  }

  @Post('withdrawals/:withdrawalId/approve')
  @Version('1')
  approveWithdrawal(
    @Param('withdrawalId') withdrawalId: string,
    @Body() body: ApprovalActionDto,
    @Req() req: AdminRequest,
  ) {
    return this.miningService.approveWithdrawal(
      withdrawalId,
      req.admin,
      body,
    );
  }

  @Post('withdrawals/:withdrawalId/reject')
  @Version('1')
  rejectWithdrawal(
    @Param('withdrawalId') withdrawalId: string,
    @Body() body: ApprovalActionDto,
    @Req() req: AdminRequest,
  ) {
    return this.miningService.rejectWithdrawal(withdrawalId, req.admin, body);
  }

  @Get('hashpower-txns')
  @Version('1')
  listHashpowerTransactions(@Query() query: PaginationQueryDto) {
    return this.miningService.listHashpowerTransactions(query);
  }

  @Post('withdrawals/dispatch')
  @Version('1')
  @AdminRoles('Super Admin', 'Finance Admin')
  dispatchApprovedWithdrawals(@Body('limit') limit?: number) {
    return this.miningService.dispatchApprovedWithdrawals(limit ?? 10);
  }
}
