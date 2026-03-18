import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(data: CreateUserDto) {
    // check if email already exists
    const existingUser = await this.userModel.findOne({ email: data.email });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = new this.userModel({
      ...data,
      password: hashedPassword,
    });

    return user.save();
  }
  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async getAllUsers() {
    return this.userModel.find().select('-password').exec();
  }
}
