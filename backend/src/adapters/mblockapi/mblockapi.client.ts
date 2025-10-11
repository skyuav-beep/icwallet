import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import pRetry from 'p-retry';

interface BaseResponse {
  result: boolean;
  message?: string;
}

export interface CreateWalletResponse extends BaseResponse {
  address?: string;
  walletKey?: string;
}

export interface BalanceResponse extends BaseResponse {
  amount?: string;
}

export interface RefreshWalletResponse extends BaseResponse {
  walletKey?: string;
}

@Injectable()
export class MBlockApiClient {
  private readonly logger = new Logger(MBlockApiClient.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>('MBLOCK_API_BASE') ?? '';
    this.apiKey = this.config.get<string>('MBLOCK_API_KEY') ?? '';
  }

  private buildConfig(): AxiosRequestConfig {
    return {
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-MBLOCK-Key': this.apiKey,
      },
    };
  }

  async createWallet(): Promise<CreateWalletResponse> {
    return await pRetry(async () => {
      const config = this.buildConfig();
      const response = await this.http.axiosRef.post<CreateWalletResponse>(
        '',
        { method: 'requestWallet' },
        config,
      );
      if (!response.data.result) {
        throw new Error(response.data.message ?? 'mblockapi wallet creation failed');
      }
      this.logger.debug('Created wallet via mblockapi');
      return response.data;
    }, {
      onFailedAttempt: (error) => {
        this.logger.warn(`Wallet creation attempt failed: ${error.message}`);
      },
      retries: 3,
      minTimeout: 50,
    });
  }

  async getBalance(address: string, contract?: string): Promise<BalanceResponse> {
    return await pRetry(async () => {
      const config = this.buildConfig();
      const response = await this.http.axiosRef.post<BalanceResponse>(
        '',
        {
          method: 'balanceOf',
          contract,
          address,
        },
        config,
      );
      if (!response.data.result) {
        throw new Error(response.data.message ?? 'mblockapi balance fetch failed');
      }
      return response.data;
    }, {
      onFailedAttempt: (error) => {
        this.logger.warn(`Balance fetch attempt failed: ${error.message}`);
      },
      retries: 3,
      minTimeout: 50,
    });
  }

  async refreshWallet(walletKey: string): Promise<RefreshWalletResponse> {
    return await pRetry(async () => {
      const config = this.buildConfig();
      const response = await this.http.axiosRef.post<RefreshWalletResponse>(
        '',
        {
          method: 'refreshWallet',
          walletKey,
        },
        config,
      );
      if (!response.data.result) {
        throw new Error(response.data.message ?? 'mblockapi wallet refresh failed');
      }
      return response.data;
    }, {
      onFailedAttempt: (error) => {
        this.logger.warn(`Wallet refresh attempt failed: ${error.message}`);
      },
      retries: 3,
      minTimeout: 50,
    });
  }
}
