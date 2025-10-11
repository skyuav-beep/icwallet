import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TerminusModule,
} from '@nestjs/terminus';
import { DatabaseHealthIndicator } from './database.health';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly database: DatabaseHealthIndicator,
  ) {}

  /**
   * Basic readiness probe.
   * 기본 준비 상태 점검 엔드포인트입니다.
   */
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.database.isHealthy()]);
  }
}
