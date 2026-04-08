import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';
import { User, UserDocument } from '../../user/schemas/user.schema';

interface RoomUser {
  userId: string;
  name: string;
  socketIds: string[];
}

@Injectable()
export class OfflineHandler {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  //   Get all users from database and save message for those not online//
  async handleMessageForOfflineUsers(
    senderId: string,
    senderName: string,
    message: string,
    onlineUsers: RoomUser[],
    isSystemMessage: boolean = false,
  ): Promise<void> {
    const allUsers = await this.userModel.find().lean().exec();
    const allUserIds = allUsers.map((user) => user._id.toString());

    const onlineUserIds = onlineUsers
      .filter((user) => user.socketIds.length > 0)
      .map((user) => user.userId);

    const offlineUsers = allUserIds.filter(
      (userId) => userId !== senderId && !onlineUserIds.includes(userId),
    );

    if (isSystemMessage) {
      // Do not store join/leave system messages for offline users.
      return;
    }

    if (offlineUsers.length > 0) {
      // Save message with pending users
      await this.messageModel.create({
        senderId,
        senderName,
        roomId: 'room1',
        message,
        timestamp: new Date(),
        pendingFor: offlineUsers,
        isSystemMessage,
      });

      if (process.env.DEBUG === 'true') {
        console.log(
          `Message saved for offline users: ${offlineUsers.join(', ')}`,
        );
      }
    }
  }

  async getPendingMessages(userId: string): Promise<Message[]> {
    return this.messageModel
      .find({
        pendingFor: userId,
      })
      .sort({ timestamp: 1 })
      .lean()
      .exec();
  }

  async markAllMessagesAsDelivered(userId: string): Promise<void> {
    const messages = await this.messageModel.find({
      pendingFor: userId,
    });

    for (const msg of messages) {
      msg.pendingFor = msg.pendingFor.filter((id) => id !== userId);

      // Delete if all users have received it
      if (msg.pendingFor.length === 0) {
        await this.messageModel.deleteOne({ _id: msg._id });

        if (process.env.DEBUG === 'true') {
          console.log(
            `Message ${String(msg._id)} deleted - all users received it`,
          );
        }
      } else {
        await msg.save();
      }
    }
  }
}
