import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  RedeemStatus,
  SettlementMethod,
  SettlementStatus,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationQueryDto } from '../dto/pagination.dto';
import { ApprovalActionDto } from '../dto/approval-action.dto';
import { AdminAuditService } from '../audit/admin-audit.service';
import { AdminActorContext } from '../guards/admin-auth.guard';
import { GenerateSettlementDto } from './dto/generate-settlement.dto';

@Injectable()
export class AdminMerchantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AdminAuditService,
  ) {}

  async listMerchants(params: PaginationQueryDto) {
    const { limit = 20, offset = 0 } = params;
    const [items, total] = await Promise.all([
      this.prisma.merchant.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          users: true,
          webhooks: true,
        },
      }),
      this.prisma.merchant.count(),
    ]);

    return {
      total,
      items,
    };
  }

  async getMerchantById(merchantId: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
      include: {
        users: true,
        webhooks: true,
        catalogItems: true,
        settlements: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        redeemLogs: {
          orderBy: { redeemedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!merchant) {
      throw new NotFoundException({
        message: 'Merchant not found.',
        messageKr: '가맹점을 찾을 수 없습니다.',
      });
    }

    return merchant;
  }

  async listSettlementQueue(params: PaginationQueryDto) {
    const { limit = 20, offset = 0 } = params;
    const [items, total] = await Promise.all([
      this.prisma.settlement.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          merchant: {
            select: { id: true, name: true, bizNo: true },
          },
        },
      }),
      this.prisma.settlement.count(),
    ]);

    return {
      total,
      items,
    };
  }

  async approveSettlement(
    settlementId: string,
    actor: AdminActorContext | undefined,
    dto: ApprovalActionDto,
  ) {
    const settlement = await this.prisma.settlement.findUnique({
      where: { id: settlementId },
    });

    if (!settlement) {
      throw new NotFoundException({
        message: 'Settlement not found.',
        messageKr: '정산 내역을 찾을 수 없습니다.',
      });
    }

    if (settlement.status !== 'PENDING' && settlement.status !== 'DRAFT') {
      throw new BadRequestException({
        message: `Cannot approve settlement in status ${settlement.status}.`,
        messageKr: `현재 상태(${settlement.status})에서는 승인할 수 없습니다.`,
      });
    }

    const updated = await this.prisma.settlement.update({
      where: { id: settlementId },
      data: {
        status: 'APPROVED',
        settledAt: new Date(),
        notes: dto.note ?? settlement.notes,
      },
    });

    await this.audit.record({
      actor,
      action: 'settlement.approve',
      targetType: 'Settlement',
      targetId: settlementId,
      metadata: {
        note: dto.note ?? null,
        previousStatus: settlement.status,
      },
    });

    return updated;
  }

  async rejectSettlement(
    settlementId: string,
    actor: AdminActorContext | undefined,
    dto: ApprovalActionDto,
  ) {
    const settlement = await this.prisma.settlement.findUnique({
      where: { id: settlementId },
    });

    if (!settlement) {
      throw new NotFoundException({
        message: 'Settlement not found.',
        messageKr: '정산 내역을 찾을 수 없습니다.',
      });
    }

    if (settlement.status !== 'PENDING' && settlement.status !== 'DRAFT') {
      throw new BadRequestException({
        message: `Cannot reject settlement in status ${settlement.status}.`,
        messageKr: `현재 상태(${settlement.status})에서는 거절할 수 없습니다.`,
      });
    }

    const updated = await this.prisma.settlement.update({
      where: { id: settlementId },
      data: {
        status: 'REJECTED',
        notes: dto.note ?? settlement.notes,
      },
    });

    await this.audit.record({
      actor,
      action: 'settlement.reject',
      targetType: 'Settlement',
      targetId: settlementId,
      metadata: {
        note: dto.note ?? null,
        previousStatus: settlement.status,
      },
    });

    return updated;
  }

  async generateSettlement(
    merchantId: string,
    dto: GenerateSettlementDto,
    actor: AdminActorContext | undefined,
  ) {
    if (dto.periodEnd <= dto.periodStart) {
      throw new BadRequestException({
        message: 'Settlement period end must be after start.',
        messageKr: '정산 종료일은 시작일보다 이후여야 합니다.',
      });
    }

    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
      select: { id: true, name: true },
    });

    if (!merchant) {
      throw new NotFoundException({
        message: 'Merchant not found.',
        messageKr: '가맹점을 찾을 수 없습니다.',
      });
    }

    const overlapping = await this.prisma.settlement.findFirst({
      where: {
        merchantId,
        status: {
          notIn: [SettlementStatus.REJECTED],
        },
        AND: [
          { periodStart: { lte: dto.periodEnd } },
          { periodEnd: { gte: dto.periodStart } },
        ],
      },
    });

    if (overlapping) {
      throw new BadRequestException({
        message: 'Settlement period overlaps with an existing batch.',
        messageKr: '이미 생성된 정산 주기와 기간이 겹칩니다.',
      });
    }

    const redeemLogs = await this.prisma.redeemLog.findMany({
      where: {
        merchantId,
        redeemedAt: {
          gte: dto.periodStart,
          lte: dto.periodEnd,
        },
        settlementId: null,
        status: {
          in: [RedeemStatus.CONFIRMED, RedeemStatus.SUBMITTED],
        },
      },
      orderBy: { redeemedAt: 'asc' },
    });

    if (redeemLogs.length === 0) {
      throw new BadRequestException({
        message: 'No redeem logs eligible for settlement in given period.',
        messageKr: '해당 기간에 정산 가능한 사용 내역이 없습니다.',
      });
    }

    const currencySet = new Set(redeemLogs.map((log) => log.currency));
    const currency =
      dto.currency ??
      (currencySet.size === 1 ? redeemLogs[0].currency : undefined);

    if (!currency) {
      throw new BadRequestException({
        message:
          'Multiple currencies detected. Provide target currency in request.',
        messageKr:
          '여러 통화가 감지되었습니다. 요청에 대상 통화를 명시하세요.',
      });
    }

    const totalAmount = redeemLogs.reduce(
      (sum, log) => sum.add(log.amount),
      new Prisma.Decimal(0),
    );

    const settlement = await this.prisma.$transaction(async (tx) => {
      const created = await tx.settlement.create({
        data: {
          merchantId,
          periodStart: dto.periodStart,
          periodEnd: dto.periodEnd,
          amount: totalAmount,
          currency,
          method: dto.method ?? SettlementMethod.ONCHAIN,
          status: SettlementStatus.PENDING,
          notes: dto.notes,
          generatedBy: actor?.id ?? null,
        },
      });

      await tx.settlementLine.createMany({
        data: redeemLogs.map((log) => ({
          settlementId: created.id,
          redeemLogId: log.id,
          netAmount: log.amount,
          feeAmount: new Prisma.Decimal(0),
        })),
      });

      await tx.redeemLog.updateMany({
        where: { id: { in: redeemLogs.map((log) => log.id) } },
        data: {
          settlementId: created.id,
          status: RedeemStatus.SETTLED,
        },
      });

      return created;
    });

    await this.audit.record({
      actor,
      action: 'settlement.generate',
      targetType: 'Settlement',
      targetId: settlement.id,
      metadata: {
        merchantId,
        periodStart: dto.periodStart.toISOString(),
        periodEnd: dto.periodEnd.toISOString(),
        currency,
        amount: settlement.amount.toString(),
      },
    });

    return settlement;
  }

  async exportSettlement(settlementId: string) {
    const settlement = await this.prisma.settlement.findUnique({
      where: { id: settlementId },
      include: {
        merchant: {
          select: { id: true, name: true, bizNo: true },
        },
        settlementLines: {
          include: {
            redeemLog: {
              select: {
                id: true,
                redeemedAt: true,
                amount: true,
                currency: true,
                status: true,
                memberId: true,
                merchantId: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!settlement) {
      throw new NotFoundException({
        message: 'Settlement not found.',
        messageKr: '정산 내역을 찾을 수 없습니다.',
      });
    }

    const lines = settlement.settlementLines.map((line) => ({
      redeemLogId: line.redeemLog.id,
      redeemedAt: line.redeemLog.redeemedAt,
      memberId: line.redeemLog.memberId,
      netAmount: line.netAmount.toString(),
      feeAmount: line.feeAmount.toString(),
      currency: line.redeemLog.currency,
      status: line.redeemLog.status,
    }));

    return {
      settlement: {
        id: settlement.id,
        merchant: settlement.merchant,
        periodStart: settlement.periodStart,
        periodEnd: settlement.periodEnd,
        amount: settlement.amount.toString(),
        currency: settlement.currency,
        method: settlement.method,
        status: settlement.status,
        generatedAt: settlement.generatedAt,
        notes: settlement.notes,
      },
      lines,
    };
  }
}
