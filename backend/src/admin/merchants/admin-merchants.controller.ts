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
import { AdminMerchantsService } from './admin-merchants.service';
import { PaginationQueryDto } from '../dto/pagination.dto';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { AdminRolesGuard } from '../guards/admin-roles.guard';
import { AdminRoles } from '../decorators/admin-roles.decorator';
import { ApprovalActionDto } from '../dto/approval-action.dto';
import type { AdminRequest } from '../guards/admin-auth.guard';
import { GenerateSettlementDto } from './dto/generate-settlement.dto';

@Controller('admin/merchants')
@UseGuards(AdminAuthGuard, AdminRolesGuard)
@AdminRoles('Super Admin', 'Operations Admin', 'Finance Admin')
export class AdminMerchantsController {
  constructor(private readonly merchantsService: AdminMerchantsService) {}

  @Get()
  @Version('1')
  listMerchants(@Query() query: PaginationQueryDto) {
    return this.merchantsService.listMerchants(query);
  }

  @Get('settlements')
  @Version('1')
  listSettlements(@Query() query: PaginationQueryDto) {
    return this.merchantsService.listSettlementQueue(query);
  }

  @Post(':merchantId/settlements')
  @Version('1')
  @AdminRoles('Super Admin', 'Finance Admin', 'Operations Admin')
  generateSettlement(
    @Param('merchantId') merchantId: string,
    @Body() body: GenerateSettlementDto,
    @Req() req: AdminRequest,
  ) {
    return this.merchantsService.generateSettlement(merchantId, body, req.admin);
  }

  @Post('settlements/:settlementId/approve')
  @Version('1')
  approveSettlement(
    @Param('settlementId') settlementId: string,
    @Body() body: ApprovalActionDto,
    @Req() req: AdminRequest,
  ) {
    return this.merchantsService.approveSettlement(settlementId, req.admin, body);
  }

  @Post('settlements/:settlementId/reject')
  @Version('1')
  rejectSettlement(
    @Param('settlementId') settlementId: string,
    @Body() body: ApprovalActionDto,
    @Req() req: AdminRequest,
  ) {
    return this.merchantsService.rejectSettlement(settlementId, req.admin, body);
  }

  @Get('settlements/:settlementId/export')
  @Version('1')
  @AdminRoles('Super Admin', 'Finance Admin')
  exportSettlement(@Param('settlementId') settlementId: string) {
    return this.merchantsService.exportSettlement(settlementId);
  }

  @Get(':merchantId')
  @Version('1')
  getMerchant(@Param('merchantId') merchantId: string) {
    return this.merchantsService.getMerchantById(merchantId);
  }
}
