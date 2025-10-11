import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MBlockApiClient } from '../adapters/mblockapi/mblockapi.client';
import { EncryptionService } from '../encryption/encryption.service';
import { createHash } from 'crypto';

/**
 * Wallet key rotation service (placeholder for automation job).
 * 지갑 키 로테이션 자동화 서비스(플레이스홀더)입니다.
 */
@Injectable()
export class WalletRotationService {
  private readonly logger = new Logger(WalletRotationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mblockApi: MBlockApiClient,
    private readonly encryption: EncryptionService,
  ) {}

  async rotateWallet(walletId: string, memberId: string) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: walletId, memberId },
      select: { walletKey: true },
    });

    if (!wallet?.walletKey) {
      this.logger.warn(`Wallet ${walletId} has no stored key to rotate.`);
      return;
    }

    const decrypted = this.encryption.decrypt(wallet.walletKey);

    const response = await this.mblockApi.refreshWallet(decrypted);
    if (!response.result || !response.walletKey) {
      throw new Error(response.message ?? 'Failed to refresh wallet key');
    }

    const encrypted = this.encryption.encrypt(response.walletKey);

    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: walletId },
        data: { walletKey: encrypted },
      }),
      this.prisma.walletRotationLog.create({
        data: {
          walletId,
          oldHash: this.hashKey(decrypted),
          newHash: this.hashKey(response.walletKey),
        },
      }),
    ]);

    this.logger.log(`Rotated wallet key for wallet ${walletId}`);
  }

  private hashKey(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }
}
