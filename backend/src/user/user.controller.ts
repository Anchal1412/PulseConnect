import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
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
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
