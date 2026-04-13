import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Room } from '../dto/create-user.dto';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  roomId: Room;

  @Prop()
  status: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
