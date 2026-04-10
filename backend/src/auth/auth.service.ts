import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{
    id: string;
    name: string;
    email: string;
    token: string;
    roomId: string;
  }> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      name: user.name,
      roomId: user.roomId,
    };

    const token = this.jwtService.sign(payload);

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      token: token,
      roomId: user.roomId,
    };
  }
}
