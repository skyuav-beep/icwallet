import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  MemberKycStatus,
  MemberStatus,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationQueryDto } from '../dto/pagination.dto';
import { MemberSearchQueryDto } from './dto/member-search-query.dto';
import { UpdateMemberStatusDto } from './dto/update-member-status.dto';
import { UpdateMemberRolesDto } from './dto/update-member-roles.dto';

@Injectable()
export class AdminMembersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly memberInclude = {
    profile: true,
    wallets: true,
    kycSubmissions: {
      orderBy: { submittedAt: 'desc' },
      take: 1,
    },
    roles: {
      include: {
        role: true,
      },
    },
  } satisfies Prisma.MemberInclude;

  async listMembers(params: PaginationQueryDto) {
    const { limit = 20, offset = 0 } = params;
    const [items, total] = await Promise.all([
      this.prisma.member.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: this.memberInclude,
      }),
      this.prisma.member.count(),
    ]);

    return {
      total,
      items,
    };
  }

  async searchMembers(params: MemberSearchQueryDto) {
    const { limit = 20, offset = 0, keyword, status, kycStatus } = params;

    const where: Prisma.MemberWhereInput = {};

    if (status) {
      where.status = status as MemberStatus;
    }

    if (kycStatus) {
      where.kycStatus = kycStatus as MemberKycStatus;
    }

    if (keyword) {
      const text = keyword.trim();
      const orConditions: Prisma.MemberWhereInput[] = [
        { email: { contains: text, mode: 'insensitive' } },
        { phone: { contains: text, mode: 'insensitive' } },
        {
          profile: {
            fullName: { contains: text, mode: 'insensitive' },
          },
        },
      ];
      where.AND = where.AND ?? [];
      where.AND.push({ OR: orConditions });
    }

    const [items, total] = await Promise.all([
      this.prisma.member.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        where,
        include: this.memberInclude,
      }),
      this.prisma.member.count({ where }),
    ]);

    return { total, items };
  }

  async getMemberById(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      include: {
        profile: true,
        wallets: true,
        whitelistAddresses: true,
        stakingPositions: true,
        lendingOffers: true,
        borrowedLoans: true,
        loanApplications: true,
        roles: {
          include: { role: true },
        },
      },
    });

    if (!member) {
      throw new NotFoundException({
        message: 'Member not found.',
        messageKr: '회원을 찾을 수 없습니다.',
      });
    }

    return member;
  }

  async updateMemberStatus(memberId: string, dto: UpdateMemberStatusDto) {
    const data: Prisma.MemberUpdateInput = {
      status: dto.status,
    };

    if (dto.kycStatus) {
      data.kycStatus = dto.kycStatus;
    }

    try {
      return await this.prisma.member.update({
        where: { id: memberId },
        data,
        include: this.memberInclude,
      });
    } catch (error) {
      if (this.isNotFoundError(error)) {
        throw new NotFoundException({
          message: 'Member not found.',
          messageKr: '회원을 찾을 수 없습니다.',
        });
      }
      throw error;
    }
  }

  async updateMemberRoles(
    memberId: string,
    dto: UpdateMemberRolesDto,
    adminId: string,
  ) {
    const roleIds = dto.roleIds ?? [];

    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { id: true },
    });

    if (!member) {
      throw new NotFoundException({
        message: 'Member not found.',
        messageKr: '회원을 찾을 수 없습니다.',
      });
    }

    if (roleIds.length > 0) {
      const roles = await this.prisma.role.findMany({
        where: { id: { in: roleIds } },
        select: { id: true },
      });

      if (roles.length !== roleIds.length) {
        throw new BadRequestException({
          message: 'One or more roles do not exist.',
          messageKr: '존재하지 않는 역할 ID가 포함되어 있습니다.',
        });
      }
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.memberRole.deleteMany({ where: { memberId } });

      if (roleIds.length > 0) {
        await tx.memberRole.createMany({
          data: roleIds.map((roleId) => ({
            memberId,
            roleId,
            assignedBy: adminId,
          })),
        });
      }
    });

    return this.prisma.member.findUnique({
      where: { id: memberId },
      include: this.memberInclude,
    });
  }

  private isNotFoundError(error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P2025'
    ) {
      return true;
    }
    return false;
  }
}
