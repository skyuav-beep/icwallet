import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { OtpService } from './strategies/otp.service';
import { InMemoryOtpStore, OTP_STORE } from './strategies/otp.store';
import { OtpRedisStore } from './strategies/otp.redis.store';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('ACCESS_TOKEN_SECRET') ?? 'change_me',
        signOptions: {
          expiresIn: Number(config.get<string>('ACCESS_TOKEN_TTL') ?? '900'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OtpService,
    OtpRedisStore,
    InMemoryOtpStore,
    {
      provide: OTP_STORE,
      useFactory: (
        config: ConfigService,
        redisStore: OtpRedisStore,
        memoryStore: InMemoryOtpStore,
      ) => {
        const redisUrl = config.get<string>('REDIS_URL');
        if (redisUrl) {
          return redisStore;
        }
        return memoryStore;
      },
      inject: [ConfigService, OtpRedisStore, InMemoryOtpStore],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
