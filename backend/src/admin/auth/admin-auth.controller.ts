import { Body, Controller, Post, Version } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';

@Controller({
  path: 'admin/auth',
  version: '1',
})
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  async login(@Body() body: AdminLoginDto) {
    return this.adminAuthService.login(body);
  }
}
