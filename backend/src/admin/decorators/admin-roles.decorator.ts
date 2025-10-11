import { SetMetadata } from '@nestjs/common';

export const ADMIN_ROLES_KEY = 'admin-roles';

/**
 * Decorator used to declare which admin roles can access an endpoint.
 * 엔드포인트에 접근 가능한 관리자 역할을 선언하는 데코레이터입니다.
 */
export const AdminRoles = (...roles: string[]) =>
  SetMetadata(ADMIN_ROLES_KEY, roles);
