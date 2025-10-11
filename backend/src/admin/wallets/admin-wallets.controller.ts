import { Controller, Get, Query, UseGuards, Version } from '@nestjs/common';
import { AdminWalletsService } from './admin-wallets.service';
import { PaginationQueryDto } from '../dto/pagination.dto';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { AdminRolesGuard } from '../guards/admin-roles.guard';
import { AdminRoles } from '../decorators/admin-roles.decorator';

@Controller('admin/wallets')
@UseGuards(AdminAuthGuard, AdminRolesGuard)
@AdminRoles('Super Admin', 'Operations Admin', 'Compliance Officer')
export class AdminWalletsController {
  constructor(private readonly walletsService: AdminWalletsService) {}

  @Get()
  @Version('1')
  listWallets(@Query() query: PaginationQueryDto) {
    return this.walletsService.listWallets(query);
  }

  @Get('whitelist')
  @Version('1')
  listWhitelist(@Query() query: PaginationQueryDto) {
    return this.walletsService.listWhitelistAddresses(query);
  }
}
