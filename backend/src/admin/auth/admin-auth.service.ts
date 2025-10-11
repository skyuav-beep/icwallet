import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcryptjs';
import { AdminLoginDto } from './dto/admin-login.dto';

interface TokenSet {
  accessToken: string;
  expiresIn: number;
}

@Injectable()
export class AdminAuthService {
  private readonly ttlSeconds: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    config: ConfigService,
  ) {
    this.ttlSeconds = Number(config.get<string>('ADMIN_JWT_TTL') ?? '1800');
  }

  async login(dto: AdminLoginDto): Promise<{ token: TokenSet }> {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!admin || admin.status !== 'ACTIVE') {
      throw new UnauthorizedException({
        message: 'Invalid admin credentials',
        messageKr: '관리자 자격 증명이 올바르지 않습니다.',
      });
    }

    const passwordMatches = await compare(dto.password, admin.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException({
        message: 'Invalid admin credentials',
        messageKr: '관리자 자격 증명이 올바르지 않습니다.',
      });
    }

    const permissions = (admin.role?.permissions ?? []).map((rp) => rp.permission.key);
    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role?.name ?? 'Super Admin',
      permissions,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.ttlSeconds,
    });

    await this.prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      token: {
        accessToken,
        expiresIn: this.ttlSeconds,
      },
    };
  }
}
