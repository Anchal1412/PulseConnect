import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { blacklistedTokens } from './blacklist';
import type { Request } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(
    @Body() body: LoginUserDto,
  ): Promise<Omit<CreateUserDto, 'password'> & { token: string }> {
    return this.authService.login(body.email, body.password);
  }

  @Post('logout')
  logout(@Req() req: Request): { message: string } {
    const authHeader = req.headers.authorization;

    if (typeof authHeader === 'string') {
      const token = authHeader.split(' ')[1];

      if (token) {
        blacklistedTokens.add(token);
      }
    }

    return { message: 'Logged out successfully' };
  }
}
