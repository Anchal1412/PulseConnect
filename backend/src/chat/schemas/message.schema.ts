import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  senderName: string;

  @Prop({ required: true })
  roomId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ type: [String], default: [] })
  deliveredTo: string[];

  @Prop({ type: [String], default: [] })
  pendingFor: string[];

  @Prop({ default: false })
  isSystemMessage: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
