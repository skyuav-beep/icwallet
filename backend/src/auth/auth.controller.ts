import { Body, Controller, Get, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RefreshDto } from './dto/refresh.dto';
import { RequestOtpDto, VerifyOtpDto } from './dto/otp.dto';

/**
 * Authentication entrypoints (placeholder).
 * 인증 관련 엔드포인트의 플레이스홀더입니다.
 */
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('status')
  getStatus() {
    return {
      message: 'Auth module skeleton ready',
      messageKr: '인증 모듈 스켈레톤 준비 완료',
    };
  }

  @Post('signup')
  async signUp(@Body() body: SignupDto) {
    return this.authService.signUp(body);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60 } })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('refresh')
  @Throttle({ default: { limit: 10, ttl: 60 } })
  async refresh(@Body() body: RefreshDto) {
    return this.authService.refreshTokens(body.refreshToken);
  }

  @Post('otp/request')
  @Throttle({ default: { limit: 3, ttl: 300 } })
  async requestOtp(@Body() body: RequestOtpDto) {
    return this.authService.requestOtp(body.email);
  }

  @Post('otp/verify')
  @Throttle({ default: { limit: 5, ttl: 300 } })
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return this.authService.verifyOtp(body.email, body.otp);
  }
}
