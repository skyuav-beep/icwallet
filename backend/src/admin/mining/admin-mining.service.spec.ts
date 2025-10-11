import { BadRequestException } from '@nestjs/common';
import { AdminMiningService } from './admin-mining.service';
import type { PrismaService } from '../../prisma/prisma.service';
import type { AdminAuditService } from '../audit/admin-audit.service';

describe('AdminMiningService', () => {
  const withdrawalFindUnique = vi.fn();
  const withdrawalUpdate = vi.fn();
  const checkpointFindFirst = vi.fn();
  const checkpointCreate = vi.fn();
  const checkpointUpdate = vi.fn();
  const signatureCreate = vi.fn();
  const auditRecord = vi.fn();

  const prismaMock = {
    withdrawalRequest: {
      findUnique: withdrawalFindUnique,
      update: withdrawalUpdate,
    },
    withdrawalCheckpoint: {
      findFirst: checkpointFindFirst,
      create: checkpointCreate,
      update: checkpointUpdate,
    },
    withdrawalCheckpointSignature: {
      create: signatureCreate,
    },
    $transaction: vi.fn(
      async (callback: (tx: PrismaService) => Promise<unknown>) =>
        callback(prismaMock as unknown as PrismaService),
    ),
  } as unknown as PrismaService & { $transaction: ReturnType<typeof vi.fn> };

  const auditMock = {
    record: auditRecord,
  } as unknown as AdminAuditService;

  const executorMock = {
    dispatchApprovedWithdrawals: vi.fn(),
  };

  let service: AdminMiningService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new AdminMiningService(
      prismaMock,
      auditMock,
      executorMock as any,
    );
  });

  it('records first finance signature and leaves withdrawal in PROCESSING', async () => {
    withdrawalFindUnique.mockResolvedValue({
      id: 'wd-1',
      status: 'PENDING',
      metadata: null,
    });
    checkpointFindFirst.mockResolvedValue(null);
    checkpointCreate.mockResolvedValue({
      id: 'cp-1',
      step: 'FINANCE_APPROVAL',
      status: 'PENDING',
      requiredSignatures: 2,
      collectedSignatures: 0,
      payload: null,
      signatures: [],
    });
    signatureCreate.mockResolvedValue({
      id: 'sig-1',
      checkpointId: 'cp-1',
      adminId: 'admin-1',
      decision: 'APPROVE',
      note: 'looks good',
      signedAt: new Date('2025-10-11T05:00:00Z'),
    });
    checkpointUpdate.mockResolvedValueOnce({
      id: 'cp-1',
      status: 'PENDING',
      requiredSignatures: 2,
      collectedSignatures: 1,
      payload: null,
      signatures: [
        { adminId: 'admin-1', decision: 'APPROVE', note: 'looks good' },
      ],
    });
    withdrawalUpdate.mockResolvedValue({
      id: 'wd-1',
      status: 'PROCESSING',
      metadata: { financePendingSignatures: 1 },
    });

    const result = await service.approveWithdrawal('wd-1', { id: 'admin-1', role: 'Finance' }, { note: 'looks good' });

    expect(signatureCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        decision: 'APPROVE',
        checkpointId: 'cp-1',
        adminId: 'admin-1',
      }),
    });
    expect(withdrawalUpdate).toHaveBeenCalledWith({
      where: { id: 'wd-1' },
      data: expect.objectContaining({ status: 'PROCESSING' }),
    });
    expect(result.status).toBe('PROCESSING');
    expect(auditRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          pendingSignatures: 1,
          collectedSignatures: 1,
        }),
      }),
    );
  });

  it('finalizes approval when required signatures reached', async () => {
    const withdrawal = {
      id: 'wd-2',
      status: 'PROCESSING',
      metadata: { financePendingSignatures: 1 },
    };
    withdrawalFindUnique.mockResolvedValue(withdrawal);
    checkpointFindFirst.mockResolvedValue({
      id: 'cp-2',
      step: 'FINANCE_APPROVAL',
      status: 'PENDING',
      requiredSignatures: 2,
      collectedSignatures: 1,
      payload: null,
      signatures: [
        { adminId: 'admin-1', decision: 'APPROVE' },
      ],
    });
    signatureCreate.mockResolvedValue({
      id: 'sig-2',
      checkpointId: 'cp-2',
      adminId: 'admin-2',
      decision: 'APPROVE',
      note: null,
      signedAt: new Date('2025-10-11T05:10:00Z'),
    });
    checkpointUpdate
      .mockResolvedValueOnce({
        id: 'cp-2',
        status: 'PENDING',
        requiredSignatures: 2,
        collectedSignatures: 2,
        payload: null,
        signatures: [
          { adminId: 'admin-1', decision: 'APPROVE' },
          { adminId: 'admin-2', decision: 'APPROVE' },
        ],
      })
      .mockResolvedValueOnce({
        id: 'cp-2',
        status: 'COMPLETED',
        requiredSignatures: 2,
        collectedSignatures: 2,
        complianceNote: null,
        signatures: [
          { adminId: 'admin-1', decision: 'APPROVE' },
          { adminId: 'admin-2', decision: 'APPROVE' },
        ],
      });
    withdrawalUpdate.mockResolvedValue({
      id: 'wd-2',
      status: 'APPROVED',
      metadata: { financeApprovals: 2 },
    });

    const result = await service.approveWithdrawal('wd-2', { id: 'admin-2', role: 'Finance' }, {});

    expect(withdrawalUpdate).toHaveBeenCalledWith({
      where: { id: 'wd-2' },
      data: expect.objectContaining({ status: 'APPROVED' }),
    });
    expect(result.status).toBe('APPROVED');
    expect(auditRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          collectedSignatures: 2,
          completed: true,
        }),
      }),
    );
  });

  it('prevents duplicate finance signature by same admin', async () => {
    withdrawalFindUnique.mockResolvedValue({
      id: 'wd-3',
      status: 'PROCESSING',
      metadata: null,
    });
    checkpointFindFirst.mockResolvedValue({
      id: 'cp-3',
      step: 'FINANCE_APPROVAL',
      status: 'PENDING',
      requiredSignatures: 2,
      collectedSignatures: 1,
      payload: null,
      signatures: [{ adminId: 'admin-3', decision: 'APPROVE' }],
    });

    await expect(
      service.approveWithdrawal('wd-3', { id: 'admin-3', role: 'Finance' }, {}),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects withdrawal and stores compliance note', async () => {
    withdrawalFindUnique.mockResolvedValue({
      id: 'wd-4',
      status: 'PENDING',
      metadata: null,
    });
    checkpointFindFirst.mockResolvedValue({
      id: 'cp-4',
      step: 'FINANCE_APPROVAL',
      status: 'PENDING',
      requiredSignatures: 2,
      collectedSignatures: 0,
      payload: null,
      signatures: [],
    });
    signatureCreate.mockResolvedValue({
      id: 'sig-4',
      checkpointId: 'cp-4',
      adminId: 'admin-4',
      decision: 'REJECT',
      note: 'AML flag',
      signedAt: new Date('2025-10-11T05:20:00Z'),
    });
    checkpointUpdate.mockResolvedValue({
      id: 'cp-4',
      status: 'REJECTED',
      requiredSignatures: 2,
      collectedSignatures: 0,
      complianceNote: 'AML flag',
      signatures: [{ adminId: 'admin-4', decision: 'REJECT' }],
    });
    withdrawalUpdate.mockResolvedValue({
      id: 'wd-4',
      status: 'REJECTED',
      metadata: { rejectionNote: 'AML flag' },
    });

    const result = await service.rejectWithdrawal('wd-4', { id: 'admin-4', role: 'Compliance' }, { note: 'AML flag' });

    expect(signatureCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ decision: 'REJECT' }),
    });
    expect(result.status).toBe('REJECTED');
    expect(auditRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'withdrawal.reject',
        metadata: expect.objectContaining({ decision: 'REJECT' }),
      }),
    );
  });

  it('dispatches approved withdrawals through executor', async () => {
    executorMock.dispatchApprovedWithdrawals.mockResolvedValue([
      { id: 'wd-100', status: 'COMPLETED', attempts: 1 },
    ]);

    const result = await service.dispatchApprovedWithdrawals(5);

    expect(executorMock.dispatchApprovedWithdrawals).toHaveBeenCalledWith(5);
    expect(result).toEqual([{ id: 'wd-100', status: 'COMPLETED', attempts: 1 }]);
  });
});
