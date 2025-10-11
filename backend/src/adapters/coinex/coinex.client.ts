import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';

export interface CoinExWithdrawalPayload {
  coin: string;
  amount: string;
  destination: string;
  memo?: string;
}

export interface CoinExWithdrawalResponse {
  success: boolean;
  txId?: string;
  message?: string;
}

@Injectable()
export class CoinExClient {
  private readonly logger = new Logger(CoinExClient.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>('COINEX_API_BASE') ?? '';
    this.apiKey = this.config.get<string>('COINEX_API_KEY') ?? '';
    this.apiSecret = this.config.get<string>('COINEX_API_SECRET') ?? '';
  }

  async submitWithdrawal(
    payload: CoinExWithdrawalPayload,
  ): Promise<CoinExWithdrawalResponse> {
    if (!this.baseUrl || !this.apiKey || !this.apiSecret) {
      this.logger.warn(
        'CoinEx client not configured; returning stub response. Configure COINEX_API_BASE/KEY/SECRET.',
      );
      return {
        success: true,
        txId: `stub-${Date.now()}`,
        message: 'CoinEx client not configured; returning stub response.',
      };
    }

    try {
      const response = await this.http.axiosRef.post<CoinExWithdrawalResponse>(
        `${this.baseUrl}/v1/withdraw`,
        payload,
        {
          headers: {
            'X-COINEX-APIKEY': this.apiKey,
            'X-COINEX-SECRET': this.apiSecret,
          },
          timeout: 10_000,
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message ?? 'CoinEx withdrawal failed');
      }

      return response.data;
    } catch (error) {
      const reason =
        error instanceof AxiosError ? error.message : (error as Error).message;
      this.logger.error(
        `CoinEx withdrawal request failed: ${reason}`,
        undefined,
        'CoinExClient',
      );
      throw error;
    }
  }
}
