import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface AuditActor {
  type: 'MEMBER' | 'ADMIN' | 'SERVICE';
  id?: string | null;
  role?: string | null;
}

export interface AuditLogRecord {
  actor: AuditActor;
  action: string;
  targetType: string;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
}

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async record(entry: AuditLogRecord) {
    const metadata = entry.metadata ? JSON.parse(JSON.stringify(entry.metadata)) : null;

    await this.prisma.auditLog.create({
      data: {
        actorType: entry.actor.type,
        actorAdminId: entry.actor.type === 'ADMIN' ? entry.actor.id ?? null : null,
        actorMemberId: entry.actor.type === 'MEMBER' ? entry.actor.id ?? null : null,
        actorServiceId: entry.actor.type === 'SERVICE' ? entry.actor.id ?? null : null,
        roleSnapshot: entry.actor.role ?? null,
        action: entry.action,
        targetType: entry.targetType,
        targetId: entry.targetId ?? undefined,
        metadata,
      },
    });
  }
}
