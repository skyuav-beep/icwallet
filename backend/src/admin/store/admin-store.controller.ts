import { Controller, Get, Query, UseGuards, Version } from '@nestjs/common';
import { AdminStoreService } from './admin-store.service';
import { PaginationQueryDto } from '../dto/pagination.dto';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { AdminRolesGuard } from '../guards/admin-roles.guard';
import { AdminRoles } from '../decorators/admin-roles.decorator';

@Controller('admin/store')
@UseGuards(AdminAuthGuard, AdminRolesGuard)
@AdminRoles('Super Admin', 'Operations Admin', 'Merchant Manager')
export class AdminStoreController {
  constructor(private readonly storeService: AdminStoreService) {}

  @Get('orders')
  @Version('1')
  listStoreOrders(@Query() query: PaginationQueryDto) {
    return this.storeService.listStoreOrders(query);
  }

  @Get('providers')
  @Version('1')
  listProviders(@Query() query: PaginationQueryDto) {
    return this.storeService.listProviders(query);
  }
}
