import { WithdrawalExecutorService } from './withdrawal-executor.service';
import type { PrismaService } from '../../prisma/prisma.service';
import type { CoinExClient } from '../../adapters/coinex/coinex.client';
import type { NotificationService } from '../../shared/notification.service';

describe('WithdrawalExecutorService', () => {
  const findMany = vi.fn();
  const update = vi.fn();
  const coinexSubmit = vi.fn();

  const prismaMock = {
    withdrawalRequest: {
      findMany,
      update,
    },
  } as unknown as PrismaService;

  const coinexMock = {
    submitWithdrawal: coinexSubmit,
  } as unknown as CoinExClient;

  const notifierMock = {
    send: vi.fn().mockResolvedValue(undefined),
  } as unknown as NotificationService;

  let service: WithdrawalExecutorService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new WithdrawalExecutorService(prismaMock, coinexMock, notifierMock);
  });

  it('completes withdrawal when CoinEx succeeds', async () => {
    findMany.mockResolvedValue([
      {
        id: 'wd-1',
        coin: 'USDT',
        amount: { toString: () => '10' },
        destAccount: 'coinex-account',
        status: 'APPROVED',
        metadata: null,
      },
    ]);
    coinexSubmit.mockResolvedValue({
      success: true,
      txId: 'coinex-123',
    });
    update.mockResolvedValue({
      id: 'wd-1',
      status: 'COMPLETED',
    });

    const results = await service.dispatchApprovedWithdrawals(1);

    expect(coinexSubmit).toHaveBeenCalledWith({
      coin: 'USDT',
      amount: '10',
      destination: 'coinex-account',
    });
    expect(update).toHaveBeenCalledWith({
      where: { id: 'wd-1' },
      data: expect.objectContaining({
        status: 'COMPLETED',
      }),
    });
    expect(results).toEqual([
      { id: 'wd-1', status: 'COMPLETED', attempts: 1, txId: 'coinex-123' },
    ]);
    expect(notifierMock.send).toHaveBeenCalledTimes(1);
  });

  it('records failure metadata when CoinEx throws', async () => {
    findMany.mockResolvedValue([
      {
        id: 'wd-2',
        coin: 'USDT',
        amount: { toString: () => '5' },
        destAccount: 'coinex-account',
        status: 'APPROVED',
        metadata: { executionAttempts: 1 },
      },
    ]);
    coinexSubmit.mockRejectedValue(new Error('CoinEx offline'));
    update.mockResolvedValue({});

    const results = await service.dispatchApprovedWithdrawals(1);

    expect(update).toHaveBeenCalledWith({
      where: { id: 'wd-2' },
      data: expect.objectContaining({
        status: 'APPROVED',
        metadata: expect.objectContaining({
          executionAttempts: 2,
          lastExecutionError: 'CoinEx offline',
        }),
      }),
    });
    expect(results).toEqual([
      {
        id: 'wd-2',
        status: 'APPROVED',
        attempts: 2,
        error: 'CoinEx offline',
      },
    ]);
    expect(notifierMock.send).toHaveBeenCalledTimes(1);
  });

  it('halts when max attempts reached', async () => {
    findMany.mockResolvedValue([
      {
        id: 'wd-3',
        coin: 'BTC',
        amount: { toString: () => '0.01' },
        destAccount: 'coinex',
        status: 'APPROVED',
        metadata: { executionAttempts: 3 },
      },
    ]);

    const results = await service.dispatchApprovedWithdrawals(1);

    expect(coinexSubmit).not.toHaveBeenCalled();
    expect(results[0]).toEqual({
      id: 'wd-3',
      status: 'APPROVED',
      attempts: 3,
      error: 'Max execution attempts reached.',
    });
    expect(notifierMock.send).toHaveBeenCalledTimes(1);
  });
});
