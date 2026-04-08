import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  getUsers(@Req() req: Request) {
    const user = req.user as { roomId?: string };
    return this.userService.getUsersByRoom(user.roomId || 'room1');
  }
}
