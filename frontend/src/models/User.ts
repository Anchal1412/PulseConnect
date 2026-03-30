import { ColorPaletteProp } from "@mui/joy/styles/types/colorSystem";

export interface User {
  _id: string;
  name: string;
  email: string;
  status: boolean;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
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
  isSystemMessage?: boolean;
}

export interface RoomUser {
  socketIds: string[];
  userId: string;
  name: string;
}

export interface ChatProps {
  socket: any;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  roomUsers: RoomUser[];
  currentUser: string;
}
