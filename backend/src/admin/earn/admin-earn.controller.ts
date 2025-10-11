import { Controller, Get, Query, UseGuards, Version } from '@nestjs/common';
import { AdminEarnService } from './admin-earn.service';
import { PaginationQueryDto } from '../dto/pagination.dto';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { AdminRolesGuard } from '../guards/admin-roles.guard';
import { AdminRoles } from '../decorators/admin-roles.decorator';

@Controller('admin/earn')
@UseGuards(AdminAuthGuard, AdminRolesGuard)
@AdminRoles('Super Admin', 'Operations Admin', 'Finance Admin')
export class AdminEarnController {
  constructor(private readonly earnService: AdminEarnService) {}

  @Get('staking-products')
  @Version('1')
  listStakingProducts(@Query() query: PaginationQueryDto) {
    return this.earnService.listStakingProducts(query);
  }

  @Get('lending-offers')
  @Version('1')
  listLendingOffers(@Query() query: PaginationQueryDto) {
    return this.earnService.listLendingOffers(query);
  }

  @Get('loan-products')
  @Version('1')
  listLoanProducts(@Query() query: PaginationQueryDto) {
    return this.earnService.listLoanProducts(query);
  }
}
