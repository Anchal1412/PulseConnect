export enum SocketEvents {
  JoinRoom = 'join_room',
  LeaveRoom = 'leave_room',
  SendMessage = 'send_message',
  GetRoomUsers = 'get_room_users',

  ReceiveMessage = 'receive_message',
  RecentMessages = 'recent_messages',
  RoomUsers = 'room_users',
  OnlineUsers = 'online_users',
}

export interface SocketData {
  userId: string;
  email: string;
  name: string;
  roomId: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  roomId: string;
}

export interface RoomUser {
  userId: string;
  name: string;
  socketIds: string[];
}

export interface ChatRoom {
  users: Map<string, RoomUser>;
}
