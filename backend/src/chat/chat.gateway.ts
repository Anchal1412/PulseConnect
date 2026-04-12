import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { OfflineHandler } from './services/offline-handler';
import { SocketData, SocketEvents, JwtPayload, RoomUser } from './models/chat';

const DEBUG = process.env.DEBUG === 'true';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private offlineHandler: OfflineHandler,
  ) {}

  private getClientData(client: Socket): SocketData {
    return client.data as SocketData;
  }

  handleConnection(client: Socket): void {
    try {
      const token: string = client.handshake.auth.token as string;

      if (!token) {
        if (DEBUG) console.log('No token provided');
        client.disconnect();
        return;
      }

      const payload: JwtPayload = this.jwtService.verify<JwtPayload>(token);

      const data = client.data as SocketData;
      data.userId = payload.sub;
      data.email = payload.email;
      data.name = payload.name;
      data.roomId = payload.roomId;
      const users: RoomUser[] = this.chatService.getRoomUsers(data.roomId);
      this.server.emit(SocketEvents.OnlineUsers, users);

      if (DEBUG) console.log(`User connected: ${payload.email}`);
    } catch (error) {
      if (DEBUG) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('WebSocket Auth Error:', errMsg);
      }
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    const data: SocketData = this.getClientData(client);

    if (DEBUG) console.log(`User disconnected: ${data?.email}`);

    this.chatService.removeUserFromAllRooms(client.id);
    const users: RoomUser[] = this.chatService.getRoomUsers(data.roomId);
    this.server.emit(SocketEvents.OnlineUsers, users);
  }

  @SubscribeMessage(SocketEvents.JoinRoom)
  async handleJoinRoom(client: Socket): Promise<void> {
    const clientData: SocketData = this.getClientData(client);
    const roomId: string = clientData.roomId;

    if (!roomId) return;

    await client.join(roomId);

    this.chatService.addUserToRoom(roomId, {
      socketId: client.id,
      userId: clientData.userId,
      name: clientData.name,
    });

    const pendingMessages = await this.offlineHandler.getPendingMessages(
      clientData.userId,
      roomId,
    );

    if (pendingMessages.length > 0) {
      const messagesToSend = pendingMessages.map((msg) => ({
        message: msg.message,
        sender: msg.senderName,
        senderId: msg.senderId,
        timestamp: msg.timestamp,
        isSystemMessage: msg.isSystemMessage,
      }));

      client.emit(SocketEvents.RecentMessages, messagesToSend);

      await this.offlineHandler.markAllMessagesAsDelivered(clientData.userId);

      if (DEBUG)
        console.log(
          `Sent ${pendingMessages.length} offline messages to user ${clientData.email}`,
        );
    }

    this.server.to(roomId).emit(SocketEvents.ReceiveMessage, {
      message: `${clientData.name} joined the room`,
      sender: clientData.name,
      senderId: clientData.userId,
      timestamp: new Date(),
      isSystemMessage: true,
      isJoin: true,
    });

    const roomUsers = this.chatService.getRoomUsers(roomId);
    this.server.to(roomId).emit(SocketEvents.RoomUsers, {
      users: roomUsers,
      count: roomUsers.length,
    });
    this.server.emit(SocketEvents.OnlineUsers, roomUsers);

    if (DEBUG) console.log(`User ${clientData.email} joined room ${roomId}`);
  }

  @SubscribeMessage(SocketEvents.LeaveRoom)
  async handleLeaveRoom(client: Socket): Promise<void> {
    const clientData = this.getClientData(client);
    const roomId = clientData.roomId;

    this.server.to(roomId).emit(SocketEvents.ReceiveMessage, {
      message: `${clientData.name} left the room`,
      sender: 'System',
      senderId: 'system',
      timestamp: new Date(),
      isSystemMessage: true,
      isJoin: false,
    });

    this.chatService.removeUserFromRoom(roomId, client.id);
    await client.leave(roomId);

    const roomUsers = this.chatService.getRoomUsers(roomId);

    this.server.to(roomId).emit(SocketEvents.RoomUsers, {
      users: roomUsers,
      count: roomUsers.length,
    });

    if (DEBUG) console.log(`User ${clientData.email} left room ${roomId}`);
  }

  @SubscribeMessage(SocketEvents.SendMessage)
  async handleSendMessage(
    client: Socket,
    payload: { message: string },
  ): Promise<void> {
    const clientData = this.getClientData(client);
    const roomId = clientData.roomId;

    if (!payload.message.trim()) return;

    const messageData = {
      message: payload.message,
      sender: clientData.name,
      senderId: clientData.userId,
      timestamp: new Date(),
      isSystemMessage: false,
    };

    this.server.to(roomId).emit(SocketEvents.ReceiveMessage, messageData);

    const roomUsers = this.chatService.getRoomUsers(roomId);

    await this.offlineHandler.handleMessageForOfflineUsers(
      clientData.userId,
      clientData.name,
      payload.message,
      roomUsers,
      roomId,
      false,
    );
  }

  @SubscribeMessage(SocketEvents.GetRoomUsers)
  handleGetRoomUsers(client: Socket, payload: { roomId: string }): void {
    const { roomId } = payload;

    const users = this.chatService.getRoomUsers(roomId);

    client.emit(SocketEvents.RoomUsers, {
      users,
      count: users.length,
    });
  }
}
