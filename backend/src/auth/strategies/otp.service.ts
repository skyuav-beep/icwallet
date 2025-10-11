import { Injectable } from '@nestjs/common';

/**
 * Placeholder service for email OTP delivery.
 * 이메일 OTP 발송을 위한 예비 서비스입니다.
 */
@Injectable()
export class OtpService {
  async generateOtp(): Promise<string> {
    // TODO: Replace with secure RNG / 보안 RNG로 교체 필요
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendEmailOtp(email: string, otp: string) {
    // TODO: Integrate transactional email provider.
    // 트랜잭션 메일 서비스 연동 필요.
    return { email, otp, status: 'queued' };
  }
}
