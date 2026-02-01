import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/auth.dto';
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser('id') userId: string) {
    const user = await this.authService.getProfile(userId);
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: {
        id: user.role.id,
        name: user.role.name,
        permissions: user.role.permissions.map((p) => p.name),
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate')
  async validateToken(@CurrentUser('id') userId: string) {
    const user = await this.authService.getProfile(userId);
    return { valid: !!user };
  }
}
