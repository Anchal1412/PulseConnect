import { Injectable } from '@nestjs/common';
import { ChatRoom, RoomUser } from './models/chat';

@Injectable()
export class ChatService {
  private rooms: Map<string, ChatRoom> = new Map();

  addUserToRoom(
    roomId: string,
    user: { socketId: string; userId: string; name: string },
  ): void {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, { users: new Map() });
    }

    const room: ChatRoom = this.rooms.get(roomId)!;

    const existingUser: RoomUser | undefined = room.users.get(user.userId);

    if (existingUser) {
      existingUser.socketIds.push(user.socketId);
    } else {
      room.users.set(user.userId, {
        userId: user.userId,
        name: user.name,
        socketIds: [user.socketId],
      });
    }
  }

  removeUserFromRoom(roomId: string, socketId: string): void {
    const room: ChatRoom | undefined = this.rooms.get(roomId);
    if (!room) return;

    room.users.forEach((user, userId) => {
      user.socketIds = user.socketIds.filter((id) => id !== socketId);

      if (user.socketIds.length === 0) {
        room.users.delete(userId);
      }
    });

    if (room.users.size === 0) {
      this.rooms.delete(roomId);
    }
  }

  removeUserFromAllRooms(socketId: string): void {
    this.rooms.forEach((room, roomId) => {
      room.users.forEach((user, userId) => {
        user.socketIds = user.socketIds.filter((id) => id !== socketId);

        if (user.socketIds.length === 0) {
          room.users.delete(userId);
        }
      });

      if (room.users.size === 0) {
        this.rooms.delete(roomId);
      }
    });
  }

  getRoomUsers(roomId: string): RoomUser[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];

    return Array.from(room.users.values());
  }

  getRoomCount(roomId: string): number {
    const room = this.rooms.get(roomId);
    return room ? room.users.size : 0;
  }
}
