import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AdminJwtPayload } from '../auth/admin-jwt.strategy';

export interface AdminActorContext {
  id: string;
  role: string;
  permissions?: string[];
}

export interface AdminRequest extends Request {
  admin?: AdminActorContext;
}

@Injectable()
export class AdminAuthGuard extends AuthGuard('admin-jwt') {
  handleRequest(
    err: unknown,
    user: AdminJwtPayload | undefined,
    _info: unknown,
    context: ExecutionContext,
  ) {
    if (err || !user) {
      throw err ||
        new UnauthorizedException({
          message: 'Invalid admin authentication token',
          messageKr: '관리자 인증 토큰이 유효하지 않습니다.',
        });
    }

    const request = context.switchToHttp().getRequest<AdminRequest>();
    request.admin = {
      id: user.sub,
      role: user.role,
      permissions: user.permissions,
    };

    return user;
  }
}
