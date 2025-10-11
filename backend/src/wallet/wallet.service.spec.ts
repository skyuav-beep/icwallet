import { WalletService } from './wallet.service';
import type { PrismaService } from '../prisma/prisma.service';
import type { MBlockApiClient } from '../adapters/mblockapi/mblockapi.client';
import type { EncryptionService } from '../encryption/encryption.service';

const createMock = vi.fn();
const balanceMock = vi.fn();
const walletCreateMock = vi.fn();
const encryptMock = vi.fn();
const decryptMock = vi.fn();

describe('WalletService', () => {
  let service: WalletService;
  const prismaMock = {
    wallet: {
      create: walletCreateMock,
      findFirst: vi.fn(),
    },
  } as unknown as PrismaService;

  const apiMock = {
    createWallet: createMock,
    getBalance: balanceMock,
  } as unknown as MBlockApiClient;

  const encryptionMock = {
    encrypt: encryptMock,
    decrypt: decryptMock,
  } as unknown as EncryptionService;

  beforeEach(() => {
    walletCreateMock.mockReset();
    createMock.mockReset();
    balanceMock.mockReset();
    prismaMock.wallet.findFirst.mockReset?.();

    encryptMock.mockReset();
    decryptMock.mockReset();
    service = new WalletService(apiMock, prismaMock, encryptionMock);
  });

  it('provisions wallet via mblockapi and stores metadata', async () => {
    createMock.mockResolvedValue({
      result: true,
      address: '0x123',
      walletKey: 'key',
    });
    encryptMock.mockReturnValue('encrypted-key');
    walletCreateMock.mockResolvedValue({
      id: 'wallet1',
      address: '0x123',
      walletKey: 'encrypted-key',
    });

    const result = await service.provisionWallet('member1');

    expect(createMock).toHaveBeenCalled();
    expect(encryptMock).toHaveBeenCalledWith('key');
    expect(walletCreateMock).toHaveBeenCalledWith({
      data: {
        memberId: 'member1',
        network: 'BNB',
        address: '0x123',
        walletKey: 'encrypted-key',
      },
    });
    expect(result.address).toBe('0x123');
  });

  it('fetches balances via mblockapi client', async () => {
    createMock.mockResolvedValue({
      result: true,
      address: '0x123',
      walletKey: 'key',
    });
    balanceMock.mockResolvedValue({
      result: true,
      amount: '1.0',
    });

    encryptMock.mockReturnValue('encrypted-key');
    await service.provisionWallet('member1');
    const balance = await service.fetchBalances('0x123');

    expect(balanceMock).toHaveBeenCalledWith('0x123');
    expect(balance).toEqual({ result: true, amount: '1.0' });
  });

  it('returns decrypted wallet key for owner', async () => {
    decryptMock.mockReturnValue('plain-key');
    prismaMock.wallet.findFirst = vi.fn().mockResolvedValue({
      walletKey: 'encrypted',
    });

    const result = await service.getWalletKey('member1', 'wallet1');

    expect(prismaMock.wallet.findFirst).toHaveBeenCalledWith({
      where: { id: 'wallet1', memberId: 'member1' },
      select: { walletKey: true },
    });
    expect(decryptMock).toHaveBeenCalledWith('encrypted');
    expect(result).toBe('plain-key');
  });

  it('throws when wallet not found for member', async () => {
    prismaMock.wallet.findFirst = vi.fn().mockResolvedValue(null);

    await expect(service.getWalletKey('member1', 'wallet1')).rejects.toMatchObject({
      status: 404,
    });
  });
});
