import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AdminRequest } from '../../admin/guards/admin-auth.guard';

export const CurrentAdmin = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AdminRequest>();
    return request.admin;
  },
);
