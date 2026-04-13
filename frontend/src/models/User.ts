import { ColorPaletteProp } from "@mui/joy/styles/types/colorSystem";
import { Socket } from "socket.io-client";

export interface User {
  _id: string;
  name: string;
  email: string;
  status: boolean;
}

export enum Room {
  Room1 = 'room1',
  Room2 = 'room2',
  Room3 = 'room3',
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  roomId: Room;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  token: string;
  roomId: string;
}

export interface SnackbarType {
  open: boolean;
  message: string;
  color: ColorPaletteProp;
};
export interface Message {
  message: string;
  sender: string;
  senderId: string;
  timestamp: Date;
  isSystemMessage: boolean;
  isJoin?: boolean;
}

export interface RoomUser {
  socketIds: string[];
  userId: string;
  name: string;
}

export interface ChatProps {
  socket: Socket | null;
  messages: Message[];
  roomUsers: RoomUser[];
  currentUser: string;
}
