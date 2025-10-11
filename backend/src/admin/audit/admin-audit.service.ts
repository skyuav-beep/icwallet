import { Injectable } from '@nestjs/common';
import { AuditLogService } from '../../shared/audit/audit-log.service';
import { AdminActorContext } from '../guards/admin-auth.guard';

@Injectable()
export class AdminAuditService {
  constructor(private readonly auditLog: AuditLogService) {}

  async record(options: {
    actor: AdminActorContext | undefined;
    action: string;
    targetType: string;
    targetId?: string;
    metadata?: Record<string, unknown>;
  }) {
    const { actor, action, targetType, targetId, metadata } = options;

    await this.auditLog.record({
      actor: {
        type: 'ADMIN',
        id: actor?.id ?? null,
        role: actor?.role ?? null,
      },
      action,
      targetType,
      targetId: targetId ?? null,
      metadata: metadata ?? null,
    });
  }
}
