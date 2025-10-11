import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogModule } from '../shared/audit/audit-log.module';
import { NotifierModule } from '../shared/notifier/notifier.module';
import { SupportService } from './support.service';

@Module({
  imports: [PrismaModule, AuditLogModule, NotifierModule],
  providers: [SupportService],
  exports: [SupportService],
})
export class SupportModule {}
