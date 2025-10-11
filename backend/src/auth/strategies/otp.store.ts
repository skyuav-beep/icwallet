import { Injectable } from '@nestjs/common';

export interface OtpStoreAdapter {
  set(email: string, otp: string): Promise<void>;
  verify(email: string, otp: string): Promise<boolean>;
}

export const OTP_STORE = Symbol('OTP_STORE');

interface OtpRecord {
  otp: string;
  expiresAt: number;
}

@Injectable()
export class InMemoryOtpStore implements OtpStoreAdapter {
  private readonly store = new Map<string, OtpRecord>();
  private readonly ttlMs = 5 * 60 * 1000;

  async set(email: string, otp: string): Promise<void> {
    const expiresAt = Date.now() + this.ttlMs;
    this.store.set(email.toLowerCase(), { otp, expiresAt });
  }

  async verify(email: string, otp: string): Promise<boolean> {
    const record = this.store.get(email.toLowerCase());
    if (!record) return false;
    const valid = record.otp === otp && record.expiresAt >= Date.now();
    if (valid) {
      this.store.delete(email.toLowerCase());
    }
    return valid;
  }
}
