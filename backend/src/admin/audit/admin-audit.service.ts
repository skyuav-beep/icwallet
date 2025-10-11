import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminActorContext } from '../guards/admin-auth.guard';

@Injectable()
export class AdminAuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(options: {
    actor: AdminActorContext | undefined;
    action: string;
    targetType: string;
    targetId?: string;
    metadata?: Record<string, unknown>;
  }) {
    const { actor, action, targetType, targetId, metadata } = options;

    await this.prisma.auditLog.create({
      data: {
        actorType: 'ADMIN',
        actorAdminId: actor?.id ?? null,
        action,
        targetType,
        targetId: targetId ?? undefined,
        roleSnapshot: actor?.role,
        metadata: metadata ?? null,
      },
    });
  }
}
