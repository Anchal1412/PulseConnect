import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserDocument } from '../user/schemas/user.schema';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<Omit<CreateUserDto, 'password'> & { token: string }> {
    const user: UserDocument | null = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      name: user.name,
      roomId: user.roomId,
    };

    const token: string = this.jwtService.sign(payload);

    return {
      name: user.name,
      email: user.email,
      token: token,
      roomId: user.roomId,
    };
  }
}
