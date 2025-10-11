import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationQueryDto } from '../dto/pagination.dto';
import { ApprovalActionDto } from '../dto/approval-action.dto';
import { AdminAuditService } from '../audit/admin-audit.service';
import { AdminActorContext } from '../guards/admin-auth.guard';
import { WithdrawalExecutorService } from './withdrawal-executor.service';

@Injectable()
export class AdminMiningService {
  private static readonly FINANCE_REQUIRED_SIGNATURES = 2;

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AdminAuditService,
    private readonly executor: WithdrawalExecutorService,
  ) {}

  async listWithdrawalRequests(params: PaginationQueryDto) {
    const { limit = 20, offset = 0 } = params;
    const [items, total] = await Promise.all([
      this.prisma.withdrawalRequest.findMany({
        skip: offset,
        take: limit,
        orderBy: { requestedAt: 'desc' },
        include: {
          member: { select: { id: true, email: true } },
          checkpoints: true,
        },
      }),
      this.prisma.withdrawalRequest.count(),
    ]);

    return { total, items };
  }

  async dispatchApprovedWithdrawals(limit = 10) {
    return this.executor.dispatchApprovedWithdrawals(limit);
  }

  async listHashpowerTransactions(params: PaginationQueryDto) {
    const { limit = 20, offset = 0 } = params;
    const [items, total] = await Promise.all([
      this.prisma.hashpowerTxn.findMany({
        skip: offset,
        take: limit,
        orderBy: { occurredAt: 'desc' },
        include: {
          member: { select: { id: true, email: true } },
        },
      }),
      this.prisma.hashpowerTxn.count(),
    ]);

    return { total, items };
  }

  async approveWithdrawal(
    withdrawalId: string,
    actor: AdminActorContext | undefined,
    dto: ApprovalActionDto,
  ) {
    const withdrawal = await this.prisma.withdrawalRequest.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      throw new NotFoundException({
        message: 'Withdrawal request not found.',
        messageKr: '출금 요청을 찾을 수 없습니다.',
      });
    }

    if (withdrawal.status !== 'PENDING' && withdrawal.status !== 'PROCESSING') {
      throw new BadRequestException({
        message: `Cannot approve withdrawal in status ${withdrawal.status}.`,
        messageKr: `현재 상태(${withdrawal.status})에서는 승인할 수 없습니다.`,
      });
    }

    const actorId = this.resolveActorId(actor);
    const result = await this.prisma.$transaction(async (tx) => {
      let checkpoint = await this.ensureFinanceCheckpoint(tx, withdrawalId);

      if (checkpoint.status === 'REJECTED') {
        throw new BadRequestException({
          message: 'Withdrawal already rejected by finance.',
          messageKr: '해당 출금은 이미 재무팀이 거절했습니다.',
        });
      }

      if (
        checkpoint.signatures.some(
          (signature) => signature.adminId === actorId && signature.decision === 'APPROVE',
        )
      ) {
        throw new BadRequestException({
          message: 'Finance signature already recorded for this admin.',
          messageKr: '이미 해당 관리자의 승인 서명이 기록되었습니다.',
        });
      }

      const signature = await tx.withdrawalCheckpointSignature.create({
        data: {
          checkpointId: checkpoint.id,
          adminId: actorId,
          decision: 'APPROVE',
          note: dto.note ?? null,
        },
      });

      checkpoint = await tx.withdrawalCheckpoint.update({
        where: { id: checkpoint.id },
        data: {
          collectedSignatures: { increment: 1 },
          payload: this.appendSignaturePayload(
            checkpoint.payload,
            actorId,
            'APPROVE',
            dto.note,
            signature.signedAt,
          ),
        },
        include: { signatures: true },
      });

      const pendingSignatures =
        checkpoint.requiredSignatures - checkpoint.collectedSignatures;

      if (pendingSignatures > 0) {
        const partial = await tx.withdrawalRequest.update({
          where: { id: withdrawalId },
          data: {
            status: withdrawal.status === 'PENDING' ? 'PROCESSING' : withdrawal.status,
            metadata: this.mergeMetadata(withdrawal.metadata, {
              financePendingSignatures: pendingSignatures,
            }),
          },
        });

        return {
          withdrawal: partial,
          checkpoint,
          completed: false,
          pendingSignatures,
        };
      }

      const completedAt = new Date();
      const updated = await tx.withdrawalRequest.update({
        where: { id: withdrawalId },
        data: {
          status: 'APPROVED',
          approvedBy: actorId,
          processedAt: completedAt,
          metadata: this.mergeMetadata(withdrawal.metadata, {
            approvalNote: dto.note ?? null,
            financeApprovals: checkpoint.collectedSignatures,
            financeApprovedAt: completedAt.toISOString(),
          }),
        },
      });

      checkpoint = await tx.withdrawalCheckpoint.update({
        where: { id: checkpoint.id },
        data: {
          status: 'COMPLETED',
          complianceNote: dto.note ?? checkpoint.complianceNote,
          completedAt,
        },
        include: { signatures: true },
      });

      return {
        withdrawal: updated,
        checkpoint,
        completed: true,
        pendingSignatures: 0,
      };
    });

    await this.audit.record({
      actor,
      action: 'withdrawal.approve',
      targetType: 'WithdrawalRequest',
      targetId: withdrawalId,
      metadata: {
        note: dto.note ?? null,
        requiredSignatures: result.checkpoint.requiredSignatures,
        collectedSignatures: result.checkpoint.collectedSignatures,
        completed: result.completed,
        pendingSignatures: result.pendingSignatures,
      },
    });

    return result.withdrawal;
  }

  async rejectWithdrawal(
    withdrawalId: string,
    actor: AdminActorContext | undefined,
    dto: ApprovalActionDto,
  ) {
    const withdrawal = await this.prisma.withdrawalRequest.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      throw new NotFoundException({
        message: 'Withdrawal request not found.',
        messageKr: '출금 요청을 찾을 수 없습니다.',
      });
    }

    if (withdrawal.status !== 'PENDING' && withdrawal.status !== 'PROCESSING') {
      throw new BadRequestException({
        message: `Cannot reject withdrawal in status ${withdrawal.status}.`,
        messageKr: `현재 상태(${withdrawal.status})에서는 거절할 수 없습니다.`,
      });
    }

    const actorId = this.resolveActorId(actor);

    const result = await this.prisma.$transaction(async (tx) => {
      let checkpoint = await this.ensureFinanceCheckpoint(tx, withdrawalId);

      const signature = await tx.withdrawalCheckpointSignature.create({
        data: {
          checkpointId: checkpoint.id,
          adminId: actorId,
          decision: 'REJECT',
          note: dto.note ?? null,
        },
      });

      const completedAt = new Date();

      checkpoint = await tx.withdrawalCheckpoint.update({
        where: { id: checkpoint.id },
        data: {
          status: 'REJECTED',
          collectedSignatures: 0,
          complianceNote: dto.note ?? checkpoint.complianceNote,
          completedAt,
          payload: this.appendSignaturePayload(
            checkpoint.payload,
            actorId,
            'REJECT',
            dto.note,
            signature.signedAt,
          ),
        },
        include: { signatures: true },
      });

      const updated = await tx.withdrawalRequest.update({
        where: { id: withdrawalId },
        data: {
          status: 'REJECTED',
          approvedBy: actorId,
          processedAt: completedAt,
          metadata: this.mergeMetadata(withdrawal.metadata, {
            rejectionNote: dto.note ?? null,
            rejectionAt: completedAt.toISOString(),
          }),
        },
      });

      return { withdrawal: updated, checkpoint };
    });

    await this.audit.record({
      actor,
      action: 'withdrawal.reject',
      targetType: 'WithdrawalRequest',
      targetId: withdrawalId,
      metadata: {
        note: dto.note ?? null,
        previousStatus: withdrawal.status,
        decision: 'REJECT',
      },
    });

    return result.withdrawal;
  }

  private async ensureFinanceCheckpoint(tx: PrismaService, withdrawalId: string) {
    let checkpoint =
      await tx.withdrawalCheckpoint.findFirst({
        where: { withdrawalId, step: 'FINANCE_APPROVAL' },
        include: { signatures: true },
      });

    if (!checkpoint) {
      checkpoint = await tx.withdrawalCheckpoint.create({
        data: {
          withdrawalId,
          step: 'FINANCE_APPROVAL',
          requiredSignatures: AdminMiningService.FINANCE_REQUIRED_SIGNATURES,
        },
        include: { signatures: true },
      });
    }

    return checkpoint;
  }

  private appendSignaturePayload(
    payload: Prisma.JsonValue | null,
    adminId: string,
    decision: string,
    note: string | null | undefined,
    signedAt: Date,
  ): Prisma.JsonValue {
    const base = this.asJsonObject(payload);
    const signatures = Array.isArray(base.signatures) ? [...base.signatures] : [];
    signatures.push({
      adminId,
      decision,
      note: note ?? null,
      signedAt: signedAt.toISOString(),
    });
    return {
      ...base,
      signatures,
    };
  }

  private mergeMetadata(
    metadata: Prisma.JsonValue | null,
    patch: Record<string, unknown>,
  ): Prisma.JsonValue {
    return {
      ...this.asJsonObject(metadata),
      ...patch,
    };
  }

  private asJsonObject(value: Prisma.JsonValue | null): Record<string, any> {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value as Record<string, any>;
    }
    return {};
  }

  private resolveActorId(actor: AdminActorContext | undefined) {
    return actor?.id ?? 'system';
  }
}
