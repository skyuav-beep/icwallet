import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { OtpStoreAdapter } from './otp.store';

@Injectable()
export class OtpRedisStore implements OtpStoreAdapter {
  private readonly logger = new Logger(OtpRedisStore.name);
  private readonly client: Redis;
  private readonly ttlSeconds = 5 * 60; // 5 minutes

  constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('REDIS_URL') ?? 'redis://localhost:6379/1';
    const db = this.config.get<number>('OTP_REDIS_DB');

    this.client = new Redis(url, db !== undefined ? { db } : undefined);
  }

  private key(email: string): string {
    return `otp:${email.toLowerCase()}`;
  }

  async set(email: string, otp: string): Promise<void> {
    try {
      await this.client.set(this.key(email), otp, 'EX', this.ttlSeconds, 'NX');
    } catch (error) {
      this.logger.error('Failed to store OTP in Redis', error as Error);
      throw error;
    }
  }

  async verify(email: string, otp: string): Promise<boolean> {
    try {
      const key = this.key(email);
      const cached = await this.client.get(key);
      if (!cached || cached !== otp) {
        return false;
      }
      await this.client.del(key);
      return true;
    } catch (error) {
      this.logger.error('Failed to verify OTP in Redis', error as Error);
      return false;
    }
  }
}
