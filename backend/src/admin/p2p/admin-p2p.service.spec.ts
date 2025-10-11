import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AdminP2PService } from './admin-p2p.service';
import type { PrismaService } from '../../prisma/prisma.service';
import type { AdminAuditService } from '../audit/admin-audit.service';

describe('AdminP2PService', () => {
  const disputeFindUnique = vi.fn();
  const disputeUpdate = vi.fn();
  const escrowFindUnique = vi.fn();
  const escrowUpdate = vi.fn();
  const auditRecord = vi.fn();

  const prismaMock = {
    dispute: {
      findUnique: disputeFindUnique,
      update: disputeUpdate,
    },
    escrow: {
      findUnique: escrowFindUnique,
      update: escrowUpdate,
    },
    $transaction: vi.fn(async (callback: (tx: PrismaService) => Promise<unknown>) =>
      callback(prismaMock as unknown as PrismaService),
    ),
  } as unknown as PrismaService & { $transaction: ReturnType<typeof vi.fn> };

  const auditMock = {
    record: auditRecord,
  } as unknown as AdminAuditService;

  let service: AdminP2PService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new AdminP2PService(prismaMock, auditMock);
  });

  it('escalates dispute once', async () => {
    disputeFindUnique.mockResolvedValue({
      id: 'dispute-1',
      result: 'PENDING',
      escrowId: 'escrow-1',
      escrow: {},
    });
    disputeUpdate.mockResolvedValue({
      id: 'dispute-1',
      result: 'ESCALATED',
    });

    const result = await service.escalateDispute(
      'dispute-1',
      { id: 'admin-1', role: 'Support Agent' },
      { note: 'Need compliance review' },
    );

    expect(disputeUpdate).toHaveBeenCalledWith({
      where: { id: 'dispute-1' },
      data: expect.objectContaining({ result: 'ESCALATED' }),
      include: { escrow: true },
    });
    expect(auditRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'dispute.escalate',
        targetId: 'dispute-1',
      }),
    );
    expect(result.result).toBe('ESCALATED');
  });

  it('throws when escalating already escalated dispute', async () => {
    disputeFindUnique.mockResolvedValue({
      id: 'dispute-1',
      result: 'ESCALATED',
      escrowId: 'escrow-1',
      escrow: {},
    });

    await expect(
      service.escalateDispute('dispute-1', undefined, {}),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('resolves dispute via release path', async () => {
    disputeFindUnique.mockResolvedValueOnce({ escrowId: 'escrow-1' });
    escrowFindUnique.mockResolvedValueOnce({
      id: 'escrow-1',
      state: 'LOCKED',
      hasDispute: true,
      dispute: { id: 'dispute-1' },
    });
    escrowUpdate.mockResolvedValue({ id: 'escrow-1', state: 'RELEASED' });
    disputeUpdate.mockResolvedValue({ id: 'dispute-1', result: 'RELEASE' });

    await service.resolveDispute(
      'dispute-1',
      { id: 'admin-1', role: 'Compliance Officer' },
      { resolution: 'RELEASE', note: 'valid proof from seller' },
    );

    expect(escrowUpdate).toHaveBeenCalled();
    expect(disputeUpdate).toHaveBeenCalledWith({
      where: { id: 'dispute-1' },
      data: expect.objectContaining({ result: 'RELEASE' }),
    });
  });

  it('throws when dispute missing for resolve', async () => {
    disputeFindUnique.mockResolvedValueOnce(null);

    await expect(
      service.resolveDispute('missing', undefined, { resolution: 'REFUND' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
