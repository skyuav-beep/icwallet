import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogModule } from '../shared/audit/audit-log.module';
import { NotifierModule } from '../shared/notifier/notifier.module';
import { TermsService } from './terms.service';

@Module({
  imports: [PrismaModule, AuditLogModule, NotifierModule],
  providers: [TermsService],
  exports: [TermsService],
})
export class TermsModule {}
