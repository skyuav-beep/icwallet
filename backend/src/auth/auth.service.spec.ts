import { beforeEach, describe, expect, it, vi } from 'vitest';
import { hash } from 'bcryptjs';
import { AuthService } from './auth.service';
import type { PrismaService } from '../prisma/prisma.service';
import type { JwtService } from '@nestjs/jwt';
import type { ConfigService } from '@nestjs/config';
import type { OtpStoreAdapter } from './strategies/otp.store';
import { OtpService } from './strategies/otp.service';

const memberDelegate = {
  findUnique: vi.fn(),
  create: vi.fn(),
};

const prismaMock = {
  member: memberDelegate,
} as unknown as PrismaService;

const jwtMock = {
  signAsync: vi.fn(),
  verifyAsync: vi.fn(),
} as unknown as JwtService;

const configMock = {
  get: vi.fn(),
} as unknown as ConfigService;

const otpServiceMock = {
  generateOtp: vi.fn(),
  sendEmailOtp: vi.fn(),
} as unknown as OtpService;

const otpStoreMock = {
  set: vi.fn(),
  verify: vi.fn(),
} as unknown as OtpStoreAdapter;

const configMap: Record<string, string> = {
  ACCESS_TOKEN_SECRET: 'test-access-secret',
  REFRESH_TOKEN_SECRET: 'test-refresh-secret',
  ACCESS_TOKEN_TTL: '900',
  REFRESH_TOKEN_TTL: '604800',
};

const mockSign = async (_payload: unknown, options?: { secret?: string }) =>
  options?.secret === 'test-access-secret' ? 'access-token' : 'refresh-token';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    memberDelegate.findUnique.mockReset();
    memberDelegate.create.mockReset();
    jwtMock.signAsync.mockReset();
    jwtMock.verifyAsync.mockReset();
    configMock.get.mockReset();
    otpServiceMock.generateOtp.mockReset();
    otpServiceMock.sendEmailOtp.mockReset();
    otpStoreMock.set.mockReset();
    otpStoreMock.verify.mockReset();

    configMock.get.mockImplementation((key: string) => configMap[key]);
    jwtMock.signAsync.mockImplementation(mockSign);
    otpServiceMock.generateOtp.mockResolvedValue('123456');
    otpServiceMock.sendEmailOtp.mockResolvedValue({ status: 'queued' });
    otpStoreMock.set.mockResolvedValue();
    otpStoreMock.verify.mockResolvedValue(true);

    service = new AuthService(
      prismaMock,
      jwtMock,
      configMock,
      otpServiceMock,
      otpStoreMock,
    );
  });

  it('registers a new member when email is unused', async () => {
    memberDelegate.findUnique.mockResolvedValue(null);
    memberDelegate.create.mockImplementation(({ data }) =>
      Promise.resolve({
        id: 'member1',
        email: data.email,
        status: 'ACTIVE',
      }),
    );

    const result = await service.signUp({
      email: 'user@example.com',
      password: 'password1234',
    });

    expect(result.member).toEqual({
      id: 'member1',
      email: 'user@example.com',
      status: 'ACTIVE',
    });
    expect(result.tokens).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
  });

  it('throws conflict when registering an existing email', async () => {
    memberDelegate.findUnique.mockResolvedValue({
      id: 'member1',
      email: 'user@example.com',
    });

    await expect(
      service.signUp({
        email: 'user@example.com',
        password: 'password1234',
      }),
    ).rejects.toMatchObject({
      status: 409,
    });
  });

  it('logs in successfully and issues tokens', async () => {
    const passwordHash = await hash('password1234', 12);
    memberDelegate.findUnique.mockResolvedValue({
      id: 'member1',
      email: 'user@example.com',
      passwordHash,
      status: 'ACTIVE',
    });

    const result = await service.login({
      email: 'user@example.com',
      password: 'password1234',
    });

    expect(result.member.email).toBe('user@example.com');
    expect(result.tokens.accessToken).toBe('access-token');
  });

  it('rejects invalid credentials', async () => {
    memberDelegate.findUnique.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'unknown@example.com',
        password: 'password1234',
      }),
    ).rejects.toMatchObject({
      status: 401,
    });
  });

  it('refreshes tokens when refresh token is valid', async () => {
    jwtMock.verifyAsync.mockResolvedValue({
      sub: 'member1',
      email: 'user@example.com',
    });
    memberDelegate.findUnique.mockResolvedValue({
      id: 'member1',
      email: 'user@example.com',
      status: 'ACTIVE',
    });

    const result = await service.refreshTokens('refresh-token');

    expect(jwtMock.verifyAsync).toHaveBeenCalledWith('refresh-token', {
      secret: 'test-refresh-secret',
    });
    expect(result.tokens.refreshToken).toBe('refresh-token');
  });

  it('rejects invalid refresh tokens', async () => {
    jwtMock.verifyAsync.mockRejectedValue(new Error('bad token'));

    await expect(service.refreshTokens('bad-token')).rejects.toMatchObject({
      status: 401,
    });
  });

  it('requests OTP when member exists', async () => {
    memberDelegate.findUnique.mockResolvedValue({
      id: 'member1',
      email: 'user@example.com',
    });

    const result = await service.requestOtp('user@example.com');

    expect(otpStoreMock.set).toHaveBeenCalledWith('user@example.com', '123456');
    expect(result.message).toBe('OTP dispatched');
  });

  it('fails OTP verification when store rejects', async () => {
    otpStoreMock.verify.mockResolvedValue(false);

    await expect(
      service.verifyOtp('user@example.com', '000000'),
    ).rejects.toMatchObject({
      status: 401,
    });
  });
});
