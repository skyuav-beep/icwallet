import { Body, Controller, Get, Param, Post, Query, Req, UseGuards, Version } from '@nestjs/common';
import { TermsService } from '../../terms/terms.service';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { AdminRolesGuard } from '../guards/admin-roles.guard';
import { AdminRoles } from '../decorators/admin-roles.decorator';
import { PublishTermsDto } from './dto/publish-terms.dto';
import { RetireTermsDto } from './dto/retire-terms.dto';
import type { AdminRequest } from '../guards/admin-auth.guard';

@Controller('admin/terms')
@UseGuards(AdminAuthGuard, AdminRolesGuard)
@AdminRoles('Super Admin', 'Compliance Officer')
export class AdminTermsController {
  constructor(private readonly termsService: TermsService) {}

  @Get()
  @Version('1')
  listTerms(@Query('type') type?: string) {
    return this.termsService.list({ type });
  }

  @Post('publish')
  @Version('1')
  publishTerms(
    @Body() body: PublishTermsDto,
    @Req() req: AdminRequest,
  ) {
    return this.termsService.publish({
      adminId: req.admin?.id ?? 'system',
      type: body.type,
      version: body.version,
      content: body.content,
      effectiveAt: new Date(body.effectiveAt),
    });
  }

  @Post(':termId/retire')
  @Version('1')
  retireTerms(
    @Param('termId') termId: string,
    @Body() body: RetireTermsDto,
    @Req() req: AdminRequest,
  ) {
    return this.termsService.retire(termId, req.admin?.id ?? 'system', body.note);
  }
}
