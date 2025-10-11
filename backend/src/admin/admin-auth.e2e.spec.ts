import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ConfigService } from '@nestjs/config';
import { AdminAuthService } from './auth/admin-auth.service';
import { AdminMembersService } from './members/admin-members.service';
import { AdminMerchantsService } from './merchants/admin-merchants.service';
import { AdminMiningService } from './mining/admin-mining.service';
import { AdminP2PService } from './p2p/admin-p2p.service';
import { PrismaService } from '../prisma/prisma.service';

const ADMIN_EMAIL = 'superadmin@icwallet.example';
const ADMIN_PASSWORD = 'ChangeMe123!';

const configStub = {
  get: (key: string) => {
    const map: Record<string, string> = {
      ADMIN_JWT_SECRET: 'test-admin-secret',
      ADMIN_JWT_TTL: '1800',
    };
    return map[key];
  },
};

const createPrismaMock = () => {
  const withdrawalCheckpoint = {
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };
  const withdrawalRequest = {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
  };
  const withdrawalCheckpointSignature = {
    create: vi.fn(),
  };
  const escrow = {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
  };
  const dispute = {
    update: vi.fn(),
  };

  const prisma = {
    adminUser: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    member: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    settlement: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    withdrawalRequest,
    withdrawalCheckpoint,
    withdrawalCheckpointSignature,
    escrow,
    dispute,
    $transaction: vi.fn(async (cb) =>
      cb({
        withdrawalCheckpoint,
        withdrawalCheckpointSignature,
        withdrawalRequest,
        escrow,
        dispute,
      }),
    ),
  } as unknown as PrismaService;

  return prisma;
};

  const auditStub = { record: vi.fn() };
const executorStub = { dispatchApprovedWithdrawals: vi.fn().mockResolvedValue([]) };
const jwtService = new JwtService({ secret: 'test-admin-secret', signOptions: { expiresIn: '1800s' } });

describe('Admin auth integration / 관리자 인증 통합 시나리오', () => {
  let prisma: PrismaService;
  let authService: AdminAuthService;
  let membersService: AdminMembersService;
  let merchantsService: AdminMerchantsService;
  let miningService: AdminMiningService;
  let p2pService: AdminP2PService;
  let adminPasswordHash: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    prisma = createPrismaMock();

    adminPasswordHash = await hash(ADMIN_PASSWORD, 12);

    (prisma.adminUser.findUnique as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      async ({ where }) => {
        if (where?.email === ADMIN_EMAIL.toLowerCase()) {
          return {
            id: 'admin-1',
            email: ADMIN_EMAIL,
            passwordHash: adminPasswordHash,
            status: 'ACTIVE',
            role: {
              name: 'Super Admin',
              permissions: [
                { permission: { key: 'wallet:manage' } },
                { permission: { key: 'wallet:withdraw.approve' } },
              ],
            },
          };
        }
        return null;
      },
    );
    (prisma.adminUser.update as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    (prisma.member.findMany as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: 'member-1', email: 'user@example.com', status: 'ACTIVE', createdAt: new Date() },
    ]);
    (prisma.member.count as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(1);

    (prisma.settlement.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'settlement-1',
      status: 'PENDING',
      notes: null,
    });
    (prisma.settlement.update as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      async ({ data }) => ({ id: 'settlement-1', ...data }),
    );

    (prisma.withdrawalRequest.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'withdrawal-1',
      status: 'PENDING',
      metadata: null,
    });
    (prisma.withdrawalRequest.update as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      async ({ data }) => ({ id: 'withdrawal-1', ...data }),
    );

    const checkpoint = {
      id: 'checkpoint-1',
      withdrawalId: 'withdrawal-1',
      step: 'FINANCE_APPROVAL',
      requiredSignatures: 2,
      collectedSignatures: 1,
      status: 'PENDING',
      payload: null,
      complianceNote: null,
      signatures: [],
    };

    (prisma.withdrawalCheckpoint.findFirst as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      checkpoint,
    );
    (prisma.withdrawalCheckpoint.update as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      async ({ data }) => ({
        ...checkpoint,
        status: data.status ?? checkpoint.status,
        collectedSignatures:
          typeof data.collectedSignatures?.increment === 'number'
            ? checkpoint.collectedSignatures + data.collectedSignatures.increment
            : checkpoint.collectedSignatures,
        complianceNote: data.complianceNote ?? checkpoint.complianceNote,
        payload: data.payload ?? checkpoint.payload,
      }),
    );
    (prisma.withdrawalCheckpointSignature.create as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      signedAt: new Date(),
    });

    (prisma.escrow.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'escrow-1',
      state: 'LOCKED',
      hasDispute: false,
      dispute: null,
    });
    (prisma.escrow.update as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      async ({ data }) => ({ id: 'escrow-1', ...data }),
    );

    authService = new AdminAuthService(
      prisma,
      jwtService,
      configStub as unknown as ConfigService,
    );
    membersService = new AdminMembersService(prisma);
    merchantsService = new AdminMerchantsService(prisma, auditStub as any);
    miningService = new AdminMiningService(prisma, auditStub as any, executorStub as any);
    p2pService = new AdminP2PService(prisma, auditStub as any);
  });

  it('logs in an admin and returns a usable JWT / 관리자를 로그인시켜 JWT를 발급한다', async () => {
    const response = await authService.login({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    expect(response.token.accessToken).toBeDefined();
    const payload = await jwtService.verifyAsync(response.token.accessToken);
    expect(payload).toMatchObject({ sub: 'admin-1', email: ADMIN_EMAIL, role: 'Super Admin' });
  });

  it('allows token holder to fetch paginated members / 토큰 보유자가 회원 목록을 조회할 수 있다', async () => {
    await authService.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    const result = await membersService.listMembers({ limit: 20, offset: 0 });
    expect(result.total).toBe(1);
    expect(result.items[0]).toMatchObject({ email: 'user@example.com' });
  });

  it('approves a settlement via admin service / 관리자 서비스로 정산 승인', async () => {
    const result = await merchantsService.approveSettlement(
      'settlement-1',
      { id: 'admin-1', role: 'Finance Admin' },
      { note: 'Approved for payout' },
    );

    expect(result.status).toBe('APPROVED');
    expect(auditStub.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'settlement.approve', targetId: 'settlement-1' }),
    );
  });

  it('approves a withdrawal via admin service / 관리자 서비스로 출금 승인', async () => {
    const result = await miningService.approveWithdrawal(
      'withdrawal-1',
      { id: 'admin-1', role: 'Finance Admin' },
      { note: 'Approved withdrawal' },
    );

    expect(result.status).toBe('APPROVED');
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(auditStub.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'withdrawal.approve', targetId: 'withdrawal-1' }),
    );
  });

  it('refunds an escrow via admin service / 관리자 서비스로 에스크로 환불', async () => {
    const result = await p2pService.refundEscrow(
      'escrow-1',
      { id: 'admin-1', role: 'Operations Admin' },
      { note: 'Refunded due to dispute' },
    );

    expect(result.state).toBe('REFUNDED');
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(auditStub.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'escrow.refund', targetId: 'escrow-1' }),
    );
  });

  it('rejects a withdrawal via admin service / 관리자 서비스로 출금을 거절', async () => {
    const result = await miningService.rejectWithdrawal(
      'withdrawal-1',
      { id: 'admin-2', role: 'Finance Admin' },
      { note: 'Flagged suspicious activity' },
    );

    expect(result.status).toBe('REJECTED');
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(auditStub.record).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'withdrawal.reject', targetId: 'withdrawal-1' }),
    );
  });

  it('throws when approving already completed settlement / 이미 승인된 정산은 예외 발생', async () => {
    (prisma.settlement.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: 'settlement-1',
      status: 'APPROVED',
      notes: null,
    });

    await expect(
      merchantsService.approveSettlement(
        'settlement-1',
        { id: 'admin-1', role: 'Finance Admin' },
        { note: 'duplicate approval' },
      ),
    ).rejects.toThrowError();
  });
});
