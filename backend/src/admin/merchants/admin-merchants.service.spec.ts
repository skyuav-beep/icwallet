import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AdminMerchantsService } from './admin-merchants.service';
import type { PrismaService } from '../../prisma/prisma.service';
import type { AdminAuditService } from '../audit/admin-audit.service';
import { Prisma } from '@prisma/client';

describe('AdminMerchantsService', () => {
  const merchantFindUnique = vi.fn();
  const settlementFindFirst = vi.fn();
  const redeemLogFindMany = vi.fn();
  const settlementCreate = vi.fn();
  const settlementLineCreateMany = vi.fn();
  const redeemLogUpdateMany = vi.fn();
  const auditRecord = vi.fn();

  const prismaMock = {
    merchant: {
      findUnique: merchantFindUnique,
    },
    settlement: {
      findFirst: settlementFindFirst,
      create: settlementCreate,
    },
    settlementLine: {
      createMany: settlementLineCreateMany,
    },
    redeemLog: {
      findMany: redeemLogFindMany,
      updateMany: redeemLogUpdateMany,
    },
    $transaction: vi.fn(async (callback: (tx: PrismaService) => Promise<unknown>) => {
      return callback(prismaMock as unknown as PrismaService);
    }),
  } as unknown as PrismaService & {
    $transaction: ReturnType<typeof vi.fn>;
  };

  const auditMock = {
    record: auditRecord,
  } as unknown as AdminAuditService;

  let service: AdminMerchantsService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new AdminMerchantsService(prismaMock, auditMock);
  });

  it('generates settlement batch for merchant and links redeem logs', async () => {
    merchantFindUnique.mockResolvedValue({ id: 'merchant-1', name: 'Merchant' });
    settlementFindFirst.mockResolvedValue(null);
    const redeemLogs = [
      {
        id: 'redeem-1',
        redeemedAt: new Date('2025-10-10T00:00:00Z'),
        amount: new Prisma.Decimal('100.50'),
        currency: 'KRW',
        status: 'CONFIRMED',
      },
      {
        id: 'redeem-2',
        redeemedAt: new Date('2025-10-10T01:00:00Z'),
        amount: new Prisma.Decimal('50.25'),
        currency: 'KRW',
        status: 'SUBMITTED',
      },
    ];
    redeemLogFindMany.mockResolvedValue(redeemLogs);
    settlementCreate.mockResolvedValue({
      id: 'settlement-1',
      amount: new Prisma.Decimal('150.75'),
      currency: 'KRW',
    });

    const result = await service.generateSettlement(
      'merchant-1',
      {
        periodStart: new Date('2025-10-01T00:00:00Z'),
        periodEnd: new Date('2025-10-31T23:59:59Z'),
      },
      { id: 'admin-1', role: 'Finance Admin' },
    );

    expect(settlementCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        merchantId: 'merchant-1',
        amount: new Prisma.Decimal('150.75'),
        currency: 'KRW',
      }),
    });
    expect(settlementLineCreateMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({ redeemLogId: 'redeem-1' }),
        expect.objectContaining({ redeemLogId: 'redeem-2' }),
      ],
    });
    expect(redeemLogUpdateMany).toHaveBeenCalledWith({
      where: { id: { in: ['redeem-1', 'redeem-2'] } },
      data: expect.objectContaining({
        settlementId: 'settlement-1',
      }),
    });
    expect(auditRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'settlement.generate',
        targetId: 'settlement-1',
      }),
    );
    expect(result.id).toBe('settlement-1');
  });

  it('throws when settlement overlaps existing batch', async () => {
    merchantFindUnique.mockResolvedValue({ id: 'merchant-1', name: 'Merchant' });
    settlementFindFirst.mockResolvedValue({ id: 'settlement-existing' });

    await expect(
      service.generateSettlement(
        'merchant-1',
        {
          periodStart: new Date('2025-10-01T00:00:00Z'),
          periodEnd: new Date('2025-10-15T00:00:00Z'),
        },
        undefined,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when redeem logs contain multiple currencies and none specified', async () => {
    merchantFindUnique.mockResolvedValue({ id: 'merchant-1', name: 'Merchant' });
    settlementFindFirst.mockResolvedValue(null);
    redeemLogFindMany.mockResolvedValue([
      {
        id: 'redeem-1',
        redeemedAt: new Date('2025-10-10T00:00:00Z'),
        amount: new Prisma.Decimal('10'),
        currency: 'KRW',
        status: 'CONFIRMED',
      },
      {
        id: 'redeem-2',
        redeemedAt: new Date('2025-10-10T02:00:00Z'),
        amount: new Prisma.Decimal('5'),
        currency: 'USD',
        status: 'CONFIRMED',
      },
    ]);

    await expect(
      service.generateSettlement(
        'merchant-1',
        {
          periodStart: new Date('2025-10-01T00:00:00Z'),
          periodEnd: new Date('2025-10-31T23:59:59Z'),
        },
        undefined,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when merchant does not exist', async () => {
    merchantFindUnique.mockResolvedValue(null);

    await expect(
      service.generateSettlement(
        'missing',
        {
          periodStart: new Date('2025-10-01T00:00:00Z'),
          periodEnd: new Date('2025-10-31T23:59:59Z'),
        },
        undefined,
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
