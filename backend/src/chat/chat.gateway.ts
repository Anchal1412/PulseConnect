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

interface SocketData {
  userId: string;
  email: string;
  name: string;
  roomId: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  roomId?: string;
}

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

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token as string;

      if (!token) {
        if (DEBUG) console.log('No token provided');
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify<JwtPayload>(token);

      const data = client.data as SocketData;
      data.userId = payload.sub;
      data.email = payload.email;
      data.name = payload.name;
      data.roomId = payload.roomId || 'room1';
      const users = this.chatService.getRoomUsers(data.roomId);
      this.server.emit('online_users', users);

      if (DEBUG) console.log(`User connected: ${payload.email}`);
    } catch (error) {
      if (DEBUG) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('WebSocket Auth Error:', errMsg);
      }
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const data = this.getClientData(client);

    if (DEBUG) console.log(`User disconnected: ${data?.email}`);

    this.chatService.removeUserFromAllRooms(client.id);
    const users = this.chatService.getRoomUsers(data?.roomId || 'room1');
    this.server.emit('online_users', users);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(client: Socket) {
    const clientData = this.getClientData(client);
    const roomId = clientData.roomId;

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

      client.emit('recent_messages', messagesToSend);

      await this.offlineHandler.markAllMessagesAsDelivered(clientData.userId);

      if (DEBUG)
        console.log(
          `Sent ${pendingMessages.length} offline messages to user ${clientData.email}`,
        );
    }

    this.server.to(roomId).emit('receive_message', {
      message: `${clientData.name} joined the room`,
      sender: clientData.name,
      senderId: clientData.userId,
      timestamp: new Date(),
      isSystemMessage: true,
      isJoin: true,
    });

    const roomUsers = this.chatService.getRoomUsers(roomId);
    this.server.to(roomId).emit('room_users', {
      users: roomUsers,
      count: roomUsers.length,
    });
    this.server.emit('online_users', roomUsers);

    if (DEBUG) console.log(`User ${clientData.email} joined room ${roomId}`);
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(client: Socket) {
    const clientData = this.getClientData(client);
    const roomId = clientData.roomId;

    this.server.to(roomId).emit('receive_message', {
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

    this.server.to(roomId).emit('room_users', {
      users: roomUsers,
      count: roomUsers.length,
    });

    if (DEBUG) console.log(`User ${clientData.email} left room ${roomId}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(client: Socket, payload: { message: string }) {
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

    this.server.to(roomId).emit('receive_message', messageData);

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

  @SubscribeMessage('get_room_users')
  handleGetRoomUsers(client: Socket, payload: { roomId: string }) {
    const { roomId } = payload;

    const users = this.chatService.getRoomUsers(roomId);

    client.emit('room_users', {
      users,
      count: users.length,
    });
  }
}
