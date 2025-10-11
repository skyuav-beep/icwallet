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
import { SupportService } from '../../support/support.service';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { AdminRolesGuard } from '../guards/admin-roles.guard';
import { AdminRoles } from '../decorators/admin-roles.decorator';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { ReplySupportTicketDto } from './dto/reply-support-ticket.dto';
import type { AdminRequest } from '../guards/admin-auth.guard';

@Controller('admin/support')
@UseGuards(AdminAuthGuard, AdminRolesGuard)
@AdminRoles('Super Admin', 'Support Agent', 'Operations Admin')
export class AdminSupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get('tickets')
  @Version('1')
  listTickets(@Query('offset') offset?: number, @Query('limit') limit?: number) {
    return this.supportService.listTickets({
      offset: offset ? Number(offset) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Post('tickets')
  @Version('1')
  createTicket(@Body() body: CreateSupportTicketDto) {
    return this.supportService.createTicket(body);
  }

  @Post('tickets/:ticketId/reply')
  @AdminRoles('Super Admin', 'Support Agent')
  @Version('1')
  replyTicket(
    @Param('ticketId') ticketId: string,
    @Body() body: ReplySupportTicketDto,
    @Req() req: AdminRequest,
  ) {
    return this.supportService.addReply(ticketId, {
      adminId: req.admin?.id ?? 'system',
      note: body.note,
    });
  }

  @Post('tickets/:ticketId/close')
  @AdminRoles('Super Admin', 'Support Agent')
  @Version('1')
  closeTicket(
    @Param('ticketId') ticketId: string,
    @Body('resolution') resolution: string,
    @Req() req: AdminRequest,
  ) {
    return this.supportService.closeTicket(ticketId, req.admin?.id ?? 'system', resolution);
  }
}
