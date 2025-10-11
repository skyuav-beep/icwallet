import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AdminP2PService } from './admin-p2p.service';
import { PaginationQueryDto } from '../dto/pagination.dto';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { AdminRolesGuard } from '../guards/admin-roles.guard';
import { AdminRoles } from '../decorators/admin-roles.decorator';
import { ApprovalActionDto } from '../dto/approval-action.dto';
import type { AdminRequest } from '../guards/admin-auth.guard';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';

@Controller('admin/p2p')
@UseGuards(AdminAuthGuard, AdminRolesGuard)
@AdminRoles('Super Admin', 'Operations Admin', 'Compliance Officer', 'Support Agent')
export class AdminP2PController {
  constructor(private readonly p2pService: AdminP2PService) {}

  @Get('orders')
  @Version('1')
  listOrders(@Query() query: PaginationQueryDto) {
    return this.p2pService.listOrders(query);
  }

  @Get('disputes')
  @Version('1')
  listDisputes(@Query() query: PaginationQueryDto) {
    return this.p2pService.listDisputes(query);
  }

  @Post('disputes/:disputeId/escalate')
  @Version('1')
  escalateDispute(
    @Param('disputeId') disputeId: string,
    @Body() body: ApprovalActionDto,
    @Req() req: AdminRequest,
  ) {
    return this.p2pService.escalateDispute(disputeId, req.admin, body);
  }

  @Put('disputes/:disputeId/resolve')
  @Version('1')
  resolveDispute(
    @Param('disputeId') disputeId: string,
    @Body() body: ResolveDisputeDto,
    @Req() req: AdminRequest,
  ) {
    return this.p2pService.resolveDispute(disputeId, req.admin, body);
  }

  @Post('escrows/:escrowId/release')
  @Version('1')
  releaseEscrow(
    @Param('escrowId') escrowId: string,
    @Body() body: ApprovalActionDto,
    @Req() req: AdminRequest,
  ) {
    return this.p2pService.releaseEscrow(escrowId, req.admin, body);
  }

  @Post('escrows/:escrowId/refund')
  @Version('1')
  refundEscrow(
    @Param('escrowId') escrowId: string,
    @Body() body: ApprovalActionDto,
    @Req() req: AdminRequest,
  ) {
    return this.p2pService.refundEscrow(escrowId, req.admin, body);
  }
}
