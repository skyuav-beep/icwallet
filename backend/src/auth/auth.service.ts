import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { hash, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OtpService } from './strategies/otp.service';
import { OTP_STORE, OtpStoreAdapter } from './strategies/otp.store';

/**
 * Authentication service handling member onboarding and credential checks.
 * 회원 가입과 자격 증명 검증을 담당하는 인증 서비스입니다.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly otpService: OtpService,
    @Inject(OTP_STORE) private readonly otpStore: OtpStoreAdapter,
  ) {}

  async signUp(dto: SignupDto) {
    const existing = await this.prisma.member.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException({
        message: 'Email already registered',
        messageKr: '이미 등록된 이메일입니다.',
      });
    }

    const passwordHash = await hash(dto.password, 12);

    const member = await this.prisma.member.create({
      data: {
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        status: true,
      },
    });

    const tokens = await this.issueTokens(member.id, member.email);

    return {
      message: 'Member registration completed',
      messageKr: '회원 가입이 완료되었습니다.',
      member,
      tokens,
    };
  }

  async login(dto: LoginDto) {
    const member = await this.prisma.member.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!member) {
      throw new UnauthorizedException({
        message: 'Invalid email or password',
        messageKr: '이메일 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    const matches = await compare(dto.password, member.passwordHash);

    if (!matches) {
      throw new UnauthorizedException({
        message: 'Invalid email or password',
        messageKr: '이메일 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    const tokens = await this.issueTokens(member.id, member.email);

    return {
      message: 'Credentials verified',
      messageKr: '자격 증명이 확인되었습니다.',
      member: {
        id: member.id,
        email: member.email,
        status: member.status,
      },
      tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    const secret =
      this.config.get<string>('REFRESH_TOKEN_SECRET') ?? 'change_refresh';

    let payload: { sub: string; email: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret,
      });
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Invalid refresh token',
        messageKr: '리프레시 토큰이 유효하지 않습니다.',
      });
    }

    const member = await this.prisma.member.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, status: true },
    });

    if (!member) {
      throw new UnauthorizedException({
        message: 'Member not found',
        messageKr: '회원을 찾을 수 없습니다.',
      });
    }

    const tokens = await this.issueTokens(member.id, member.email);

    return {
      message: 'Tokens refreshed',
      messageKr: '토큰이 갱신되었습니다.',
      member,
      tokens,
    };
  }

  async requestOtp(email: string) {
    const member = await this.prisma.member.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!member) {
      throw new UnauthorizedException({
        message: 'Member not found',
        messageKr: '회원을 찾을 수 없습니다.',
      });
    }

    const otp = await this.otpService.generateOtp();
    await this.otpStore.set(member.email, otp);
    const dispatch = await this.otpService.sendEmailOtp(member.email, otp);

    return {
      message: 'OTP dispatched',
      messageKr: 'OTP가 발송되었습니다.',
      dispatch,
    };
  }

  async verifyOtp(email: string, otp: string) {
    const isValid = await this.otpStore.verify(email, otp);

    if (!isValid) {
      throw new UnauthorizedException({
        message: 'OTP verification failed',
        messageKr: 'OTP 검증에 실패했습니다.',
      });
    }

    return {
      message: 'OTP verified',
      messageKr: 'OTP가 확인되었습니다.',
    };
  }

  private async issueTokens(memberId: string, email: string) {
    const accessSecret =
      this.config.get<string>('ACCESS_TOKEN_SECRET') ?? 'change_access';
    const refreshSecret =
      this.config.get<string>('REFRESH_TOKEN_SECRET') ?? 'change_refresh';
    const accessTtl =
      this.config.get<string>('ACCESS_TOKEN_TTL') ?? this.config.get<string>('JWT_EXPIRES_IN') ?? '900';
    const refreshTtl =
      this.config.get<string>('REFRESH_TOKEN_TTL') ?? '604800';

    const payload = { sub: memberId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: Number(accessTtl),
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: Number(refreshTtl),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
