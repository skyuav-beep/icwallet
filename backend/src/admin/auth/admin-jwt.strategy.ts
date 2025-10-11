import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface AdminJwtPayload {
  sub: string;
  email: string;
  role: string;
  permissions?: string[];
}

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('ADMIN_JWT_SECRET') ?? 'change_admin_secret',
    });
  }

  validate(payload: AdminJwtPayload): AdminJwtPayload {
    return payload;
  }
}
