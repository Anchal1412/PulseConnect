import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto, Room } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(data: CreateUserDto): Promise<boolean> {
    const existingUser = await this.userModel.findOne({ email: data.email });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = new this.userModel({
      ...data,
      password: hashedPassword,
    });

    await user.save();
    return true;
  }
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async getUsersByRoom(
    roomId: Room,
  ): Promise<Omit<CreateUserDto, 'password'>[]> {
    return this.userModel.find({ roomId }).select('-password').exec();
  }
}
