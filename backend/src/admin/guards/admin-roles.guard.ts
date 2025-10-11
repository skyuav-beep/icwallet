import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_ROLES_KEY } from '../decorators/admin-roles.decorator';
import { AdminRequest } from './admin-auth.guard';

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ADMIN_ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AdminRequest>();
    const role = request.admin?.role;

    if (!role) {
      throw new ForbiddenException({
        message: 'Admin role not resolved',
        messageKr: '관리자 역할을 확인할 수 없습니다.',
      });
    }

    if (!requiredRoles.includes(role)) {
      throw new ForbiddenException({
        message: 'Insufficient admin role',
        messageKr: '접근 권한이 없습니다.',
      });
    }

    return true;
  }
}
