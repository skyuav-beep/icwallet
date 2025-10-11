import { Injectable, NotFoundException } from '@nestjs/common';
import { MBlockApiClient } from '../adapters/mblockapi/mblockapi.client';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { EncryptionService } from '../encryption/encryption.service';
import { Prisma } from '@prisma/client';
import {
  WalletAlertDto,
  WalletOverviewDto,
  WalletBalanceSnapshotDto,
} from './dto';

/**
 * Placeholder for wallet orchestration (provisioning, balances, swaps).
 * 지갑 발급, 잔액 조회, 스왑 등을 담당할 서비스의 플레이스홀더입니다.
 */
@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  constructor(
    private readonly mblockApi: MBlockApiClient,
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
  ) {}

  async provisionWallet(memberId: string) {
    const wallet = await this.mblockApi.createWallet();
    if (!wallet.address) {
      throw new Error(wallet.message ?? 'Failed to create wallet');
    }
    this.logger.log(`Provisioned wallet for member ${memberId}`);

    const encryptedKey = wallet.walletKey
      ? this.encryption.encrypt(wallet.walletKey)
      : undefined;

    return this.prisma.wallet.create({
      data: {
        memberId,
        network: 'BNB',
        address: wallet.address,
        walletKey: encryptedKey,
      },
    });
  }

  async fetchBalances(address: string) {
    return this.mblockApi.getBalance(address);
  }

  async getOverview(memberId: string): Promise<WalletOverviewDto> {
    const wallets = await this.prisma.wallet.findMany({
      where: { memberId },
      orderBy: { createdAt: 'asc' },
      include: {
        balanceSnapshots: {
          orderBy: { capturedAt: 'desc' },
          take: 10,
        },
      },
    });

    const walletIds = wallets.map((wallet) => wallet.id);
    const preferredNetwork =
      wallets.find((wallet) => wallet.network === 'ISC')?.network ??
      wallets[0]?.network ??
      'ISC';

    const pendingWhitelist = await this.prisma.whitelistAddress.count({
      where: { memberId, status: 'PENDING' },
    });

    const pendingWithdrawals = await this.prisma.withdrawalRequest.count({
      where: { memberId, status: 'PENDING' },
    });

    const alerts: WalletAlertDto[] = [];
    if (pendingWhitelist > 0) {
      alerts.push({
        kind: 'WHITELIST_REQUIRED',
        severity: 'warning',
        message:
          'Pending whitelist approval detected. Complete whitelist setup before requesting withdrawals.',
        messageKr:
          '화이트리스트 승인 대기 항목이 있습니다. 출금 요청 전에 화이트리스트 등록을 완료하세요.',
      });
    }
    if (pendingWithdrawals > 0) {
      alerts.push({
        kind: 'PENDING_APPROVAL',
        severity: 'info',
        message:
          'There are withdrawal requests awaiting admin review. Track progress in the withdrawal history.',
        messageKr:
          '관리자 검토 대기 중인 출금 요청이 있습니다. 출금 내역에서 진행 상황을 확인하세요.',
      });
    }

    if (walletIds.length > 0) {
      const networks = Array.from(new Set(wallets.map((wallet) => wallet.network)));
      const networkSettings =
        await this.prisma.walletNetworkSetting.findMany({
          where: { network: { in: networks } },
        });

      networkSettings
        .filter(
          (setting) =>
            setting.maintenanceState ||
            !setting.withdrawEnabled ||
            !setting.depositEnabled,
        )
        .forEach((setting) => {
          alerts.push({
            kind: 'API_DEGRADED',
            severity: 'critical',
            message: `Network ${setting.network} is under maintenance or restricted. Some wallet actions may be limited.`,
            messageKr: `네트워크 ${setting.network}가 점검 중이거나 제한 상태입니다. 일부 지갑 작업이 제한될 수 있습니다.`,
          });
        });
    }

    const balanceDtos = await this.mapBalanceSnapshots(wallets);

    return {
      memberId,
      preferredNetwork: preferredNetwork as 'ISC' | 'BNB',
      balances: balanceDtos,
      alerts,
    };
  }

  private async mapBalanceSnapshots(
    wallets: Array<
      Prisma.WalletGetPayload<{
        include: { balanceSnapshots: true };
      }>
    >,
  ): Promise<WalletBalanceSnapshotDto[]> {
    const tokenIds = new Set<string>();
    wallets.forEach((wallet) =>
      wallet.balanceSnapshots.forEach((snapshot) => {
        if (snapshot.assetType === 'TOKEN') {
          tokenIds.add(snapshot.assetId);
        }
      }),
    );

    const tokens =
      tokenIds.size > 0
        ? await this.prisma.token.findMany({
            where: { id: { in: Array.from(tokenIds) } },
          })
        : [];

    const tokenMap = new Map(tokens.map((token) => [token.id, token]));

    const balanceDtos: WalletBalanceSnapshotDto[] = [];

    wallets.forEach((wallet) => {
      wallet.balanceSnapshots.forEach((snapshot) => {
        const token = tokenMap.get(snapshot.assetId);
        balanceDtos.push({
          network: wallet.network,
          assetSymbol: token?.symbol ?? snapshot.assetId,
          assetType: snapshot.assetType as 'TOKEN' | 'NFT',
          contractAddress: token?.contract,
          balance: snapshot.amount.toString(),
          displayName: token?.name ?? snapshot.assetId,
          displayNameKr: token?.name ?? snapshot.assetId,
          updatedAt: snapshot.capturedAt.toISOString(),
        });
      });
    });

    balanceDtos.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    return balanceDtos;
  }

  async getWalletKey(memberId: string, walletId: string) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: walletId, memberId },
      select: { walletKey: true },
    });

    if (!wallet) {
      throw new NotFoundException({
        message: 'Wallet not found',
        messageKr: '지갑을 찾을 수 없습니다.',
      });
    }

    if (!wallet.walletKey) {
      return null;
    }

    return this.encryption.decrypt(wallet.walletKey);
  }
}
