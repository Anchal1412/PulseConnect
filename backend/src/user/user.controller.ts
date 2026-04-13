import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto, Room } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  async signup(@Body() body: CreateUserDto): Promise<boolean> {
    return this.userService.createUser(body);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getUsers(
    @Req() req: Request,
  ): Promise<Omit<CreateUserDto, 'password'>[]> {
    const user = req.user as { roomId: Room };
    return this.userService.getUsersByRoom(user.roomId);
  }
}
