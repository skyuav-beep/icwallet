import { Injectable, Logger } from '@nestjs/common';
import { Prisma, WithdrawalStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CoinExClient } from '../../adapters/coinex/coinex.client';
import { TelegramNotifierService } from '../../shared/notifier/telegram-notifier.service';

interface ExecutionResult {
  id: string;
  status: WithdrawalStatus;
  attempts: number;
  txId?: string;
  error?: string;
}

@Injectable()
export class WithdrawalExecutorService {
  private readonly logger = new Logger(WithdrawalExecutorService.name);
  private static readonly MAX_ATTEMPTS = 3;

  constructor(
    private readonly prisma: PrismaService,
    private readonly coinExClient: CoinExClient,
    private readonly notifier: TelegramNotifierService,
  ) {}

  /**
   * Processes a batch of approved withdrawals and dispatches them to CoinEx.
   * 승인 완료된 출금 요청 한 배치를 CoinEx로 전송합니다.
   */
  async dispatchApprovedWithdrawals(batchSize = 10): Promise<ExecutionResult[]> {
    const approvals = await this.prisma.withdrawalRequest.findMany({
      where: {
        status: 'APPROVED',
      },
      orderBy: { processedAt: 'asc' },
      take: batchSize,
    });

    const results: ExecutionResult[] = [];

    for (const withdrawal of approvals) {
      try {
        const metadata = this.toJsonObject(withdrawal.metadata);
        const attempts = Number(metadata.executionAttempts ?? 0);

        if (attempts >= WithdrawalExecutorService.MAX_ATTEMPTS) {
          results.push({
            id: withdrawal.id,
            status: withdrawal.status,
            attempts,
            error: 'Max execution attempts reached.',
          });
          await this.notifyThresholdReached(withdrawal.id, attempts);
          continue;
        }

        const response = await this.coinExClient.submitWithdrawal({
          coin: withdrawal.coin,
          amount: withdrawal.amount.toString(),
          destination: withdrawal.destAccount,
        });

        const updated = await this.prisma.withdrawalRequest.update({
          where: { id: withdrawal.id },
          data: {
            status: response.success ? 'COMPLETED' : 'FAILED',
            metadata: {
              ...metadata,
              coinexTxId: response.txId ?? null,
              executionAttempts: attempts + 1,
              lastExecutionAt: new Date().toISOString(),
              executionMessage: response.message ?? null,
            },
          },
        });

        results.push({
          id: updated.id,
          status: updated.status,
          attempts: attempts + 1,
          txId: response.txId,
        });

        await this.notifier.send(
          this.buildMessage({
            id: updated.id,
            coin: withdrawal.coin,
            amount: withdrawal.amount.toString(),
            destination: withdrawal.destAccount,
            status: updated.status,
            attempts: attempts + 1,
            txId: response.txId,
            message: response.message,
          }),
        );
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        this.logger.error(
          `Failed to execute withdrawal ${withdrawal.id}: ${reason}`,
        );

        const metadata = this.toJsonObject(withdrawal.metadata);
        const attempts = Number(metadata.executionAttempts ?? 0) + 1;

        await this.prisma.withdrawalRequest.update({
          where: { id: withdrawal.id },
          data: {
            status:
              attempts >= WithdrawalExecutorService.MAX_ATTEMPTS
                ? 'FAILED'
                : 'APPROVED',
            metadata: {
              ...metadata,
              executionAttempts: attempts,
              lastExecutionError: reason,
              lastExecutionAt: new Date().toISOString(),
            },
          },
        });

        results.push({
          id: withdrawal.id,
          status:
            attempts >= WithdrawalExecutorService.MAX_ATTEMPTS
              ? 'FAILED'
              : 'APPROVED',
          attempts,
          error: reason,
        });

        await this.notifier.send(
          this.buildMessage({
            id: withdrawal.id,
            coin: withdrawal.coin,
            amount: withdrawal.amount.toString(),
            destination: withdrawal.destAccount,
            status:
              attempts >= WithdrawalExecutorService.MAX_ATTEMPTS
                ? 'FAILED'
                : 'APPROVED',
            attempts,
            error: reason,
          }),
        );
      }
    }

    return results;
  }

  private async notifyThresholdReached(withdrawalId: string, attempts: number) {
    await this.notifier.send(
      `⚠️ *CoinEx 출금 재시도 제한*\n- ID: \`${withdrawalId}\`\n- 시도 횟수: ${attempts}\n- 상태: 재검토 필요`,
    );
  }

  private buildMessage(input: {
    id: string;
    coin: string;
    amount: string;
    destination: string;
    status: WithdrawalStatus;
    attempts: number;
    txId?: string;
    message?: string;
    error?: string;
  }) {
    const header =
      input.status === 'COMPLETED'
        ? '✅ *CoinEx 출금 완료*'
        : input.status === 'FAILED'
        ? '❌ *CoinEx 출금 실패*'
        : '⭕️ *CoinEx 출금 재시도 대기*';

    const lines = [
      header,
      `- ID: \`${input.id}\``,
      `- 코인: ${input.coin}`,
      `- 수량: ${input.amount}`,
      `- 목적지: \`${input.destination}\``,
      `- 상태: ${input.status}`,
      `- 시도 횟수: ${input.attempts}`,
    ];

    if (input.txId) {
      lines.push(`- TX ID: \`${input.txId}\``);
    }

    if (input.message) {
      lines.push(`- 메시지: ${input.message}`);
    }

    if (input.error) {
      lines.push(`- 오류: ${input.error}`);
    }

    return lines.join('\n');
  }

  private toJsonObject(
    metadata: Prisma.JsonValue | null,
  ): Record<string, any> {
    if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
      return metadata as Record<string, any>;
    }
    return {};
  }
}
