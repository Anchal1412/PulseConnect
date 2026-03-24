import { Injectable } from '@nestjs/common';

interface RoomUser {
  socketId: string;
  userId: string;
  name: string;
}

interface ChatRoom {
  users: RoomUser[];
}

@Injectable()
export class ChatService {
  private rooms: Map<string, ChatRoom> = new Map();

  addUserToRoom(roomId: string, user: RoomUser) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, { users: [] });
    }

    const room = this.rooms.get(roomId)!;
    // Check if user already exists
    const existingUser = room.users.find((u) => u.socketId === user.socketId);
    if (!existingUser) {
      room.users.push(user);
    }
  }

  removeUserFromRoom(roomId: string, socketId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.users = room.users.filter((u) => u.socketId !== socketId);
      // Remove empty rooms
      if (room.users.length === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  removeUserFromAllRooms(socketId: string) {
    this.rooms.forEach((room, roomId) => {
      room.users = room.users.filter((u) => u.socketId !== socketId);
      if (room.users.length === 0) {
        this.rooms.delete(roomId);
      }
    });
  }

  getRoomUsers(roomId: string): RoomUser[] {
    const room = this.rooms.get(roomId);
    return room ? room.users : [];
  }

  getRoomCount(roomId: string): number {
    return this.getRoomUsers(roomId).length;
  }
}
