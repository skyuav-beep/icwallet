import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DisputeResult } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationQueryDto } from '../dto/pagination.dto';
import { ApprovalActionDto } from '../dto/approval-action.dto';
import { AdminAuditService } from '../audit/admin-audit.service';
import { AdminActorContext } from '../guards/admin-auth.guard';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';

@Injectable()
export class AdminP2PService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AdminAuditService,
  ) {}

  async listOrders(params: PaginationQueryDto) {
    const { limit = 20, offset = 0 } = params;
    const [items, total] = await Promise.all([
      this.prisma.p2POrder.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          maker: {
            select: { id: true, email: true, status: true },
          },
          escrows: {
            include: {
              taker: {
                select: { id: true, email: true },
              },
              dispute: true,
            },
          },
        },
      }),
      this.prisma.p2POrder.count(),
    ]);

    return { total, items };
  }

  async listDisputes(params: PaginationQueryDto) {
    const { limit = 20, offset = 0 } = params;
    const [items, total] = await Promise.all([
      this.prisma.dispute.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          escrow: {
            include: {
              order: true,
            },
          },
          evidences: true,
        },
      }),
      this.prisma.dispute.count(),
    ]);

    return { total, items };
  }

  async escalateDispute(
    disputeId: string,
    actor: AdminActorContext | undefined,
    dto: ApprovalActionDto,
  ) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { escrow: true },
    });

    if (!dispute) {
      throw new NotFoundException({
        message: 'Dispute not found.',
        messageKr: '분쟁을 찾을 수 없습니다.',
      });
    }

    if (dispute.result === DisputeResult.ESCALATED) {
      throw new BadRequestException({
        message: 'Dispute already escalated.',
        messageKr: '이미 에스컬레이션된 분쟁입니다.',
      });
    }

    const updated = await this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        result: 'ESCALATED',
        resolvedBy: actor?.id ?? null,
        resolvedAt: new Date(),
      },
      include: { escrow: true },
    });

    await this.audit.record({
      actor,
      action: 'dispute.escalate',
      targetType: 'Dispute',
      targetId: disputeId,
      metadata: {
        note: dto.note ?? null,
        previousResult: dispute.result,
        escrowId: dispute.escrowId,
      },
    });

    return updated;
  }

  async resolveDispute(
    disputeId: string,
    actor: AdminActorContext | undefined,
    dto: ResolveDisputeDto,
  ) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
      select: { escrowId: true },
    });

    if (!dispute) {
      throw new NotFoundException({
        message: 'Dispute not found.',
        messageKr: '분쟁을 찾을 수 없습니다.',
      });
    }

    const noteDto: ApprovalActionDto = { note: dto.note };

    if (dto.resolution === 'RELEASE') {
      return this.releaseEscrow(dispute.escrowId, actor, noteDto);
    }

    return this.refundEscrow(dispute.escrowId, actor, noteDto);
  }

  async releaseEscrow(
    escrowId: string,
    actor: AdminActorContext | undefined,
    dto: ApprovalActionDto,
  ) {
    const escrow = await this.prisma.escrow.findUnique({
      where: { id: escrowId },
      include: { dispute: true },
    });

    if (!escrow) {
      throw new NotFoundException({
        message: 'Escrow not found.',
        messageKr: '에스크로를 찾을 수 없습니다.',
      });
    }

    if (escrow.state === 'RELEASED') {
      throw new BadRequestException({
        message: 'Escrow already released.',
        messageKr: '이미 해제된 에스크로입니다.',
      });
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.escrow.update({
        where: { id: escrowId },
        data: {
          state: 'RELEASED',
          releasedAt: new Date(),
          hasDispute: escrow.hasDispute,
        },
      });

      if (escrow.dispute) {
        await tx.dispute.update({
          where: { id: escrow.dispute.id },
          data: {
            result: 'RELEASE',
            resolvedBy: actor?.id ?? null,
            resolvedAt: new Date(),
          },
        });
      }

      return updated;
    });

    await this.audit.record({
      actor,
      action: 'escrow.release',
      targetType: 'Escrow',
      targetId: escrowId,
      metadata: {
        note: dto.note ?? null,
        previousState: escrow.state,
      },
    });

    return result;
  }

  async refundEscrow(
    escrowId: string,
    actor: AdminActorContext | undefined,
    dto: ApprovalActionDto,
  ) {
    const escrow = await this.prisma.escrow.findUnique({
      where: { id: escrowId },
      include: { dispute: true },
    });

    if (!escrow) {
      throw new NotFoundException({
        message: 'Escrow not found.',
        messageKr: '에스크로를 찾을 수 없습니다.',
      });
    }

    if (escrow.state === 'REFUNDED') {
      throw new BadRequestException({
        message: 'Escrow already refunded.',
        messageKr: '이미 환불된 에스크로입니다.',
      });
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.escrow.update({
        where: { id: escrowId },
        data: {
          state: 'REFUNDED',
          releasedAt: new Date(),
          hasDispute: escrow.hasDispute,
        },
      });

      if (escrow.dispute) {
        await tx.dispute.update({
          where: { id: escrow.dispute.id },
          data: {
            result: 'REFUND',
            resolvedBy: actor?.id ?? null,
            resolvedAt: new Date(),
          },
        });
      }

      return updated;
    });

    await this.audit.record({
      actor,
      action: 'escrow.refund',
      targetType: 'Escrow',
      targetId: escrowId,
      metadata: {
        note: dto.note ?? null,
        previousState: escrow.state,
      },
    });

    return result;
  }
}
