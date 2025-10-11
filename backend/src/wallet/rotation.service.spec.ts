import nock from 'nock';
import axios from 'axios';
import { WalletRotationService } from './rotation.service';
import type { PrismaService } from '../prisma/prisma.service';
import type { MBlockApiClient } from '../adapters/mblockapi/mblockapi.client';
import type { EncryptionService } from '../encryption/encryption.service';

const baseUrl = 'https://agent.mblockapi.com/bsc';

const prismaMock = {
  wallet: {
    findFirst: vi.fn(),
    update: vi.fn(),
  },
  walletRotationLog: {
    create: vi.fn(),
  },
  $transaction: vi.fn((operations: any[]) => Promise.all(operations)),
} as unknown as PrismaService;

const mblockMock = {
  refreshWallet: vi.fn(),
} as unknown as MBlockApiClient;

const encryptionMock = {
  decrypt: vi.fn(),
  encrypt: vi.fn(),
} as unknown as EncryptionService;

describe('WalletRotationService', () => {
  let service: WalletRotationService;

  beforeEach(() => {
    prismaMock.wallet.findFirst.mockReset();
    prismaMock.wallet.update.mockReset();
    prismaMock.walletRotationLog.create.mockReset();
    mblockMock.refreshWallet.mockReset();
    encryptionMock.decrypt.mockReset();
    encryptionMock.encrypt.mockReset();

    service = new WalletRotationService(prismaMock, mblockMock, encryptionMock);
  });

  it('rotates wallet key when wallet exists', async () => {
    prismaMock.wallet.findFirst.mockResolvedValue({ walletKey: 'stored' });
    encryptionMock.decrypt.mockReturnValue('plain');
    mblockMock.refreshWallet.mockResolvedValue({ result: true, walletKey: 'new' });
    encryptionMock.encrypt.mockReturnValue('encrypted');

    await service.rotateWallet('wallet1', 'member1');

    expect(encryptionMock.decrypt).toHaveBeenCalledWith('stored');
    expect(mblockMock.refreshWallet).toHaveBeenCalledWith('plain');
    expect(prismaMock.wallet.update).toHaveBeenCalledWith({
      where: { id: 'wallet1' },
      data: { walletKey: 'encrypted' },
    });
  });

  it('skips rotation when wallet not found', async () => {
    prismaMock.wallet.findFirst.mockResolvedValue(null);

    await service.rotateWallet('wallet1', 'member1');

    expect(mblockMock.refreshWallet).not.toHaveBeenCalled();
  });
});
