import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Box,
  Button,
  Sheet,
  Typography,
  Chip,
  Snackbar,
  Textarea,
} from '@mui/joy';

interface Message {
  message: string;
  sender: string;
  senderId: string;
  timestamp: Date;
  isSystemMessage?: boolean;
}

interface RoomUser {
  socketId: string;
  userId: string;
  name: string;
}

const Chat: React.FC = () => {
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
  const [currentUser, setCurrentUser] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    color: 'neutral' as 'neutral' | 'success' | 'danger',
  });

  // SOCKET CONNECTION
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setSnackbar({
        open: true,
        message: 'No token found. Please login again.',
        color: 'danger',
      });
      return;
    }

    // extract name from JWT
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUser(payload.name);
    } catch (err) {
      console.error('Invalid token');
    }

    socketRef.current = io('http://localhost:3001', {
      auth: {
        token: token.trim(),
      },
    });

    socketRef.current.on('connect', () => {
      setSnackbar({
        open: true,
        message: 'Connected to chat server',
        color: 'success',
      });

      socketRef.current?.emit('join_room', { roomId: 'room1' });
    });

    socketRef.current.on('disconnect', () => {
      setSnackbar({
        open: true,
        message: 'Disconnected from chat server',
        color: 'danger',
      });
    });

    socketRef.current.on('receive_message', (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    socketRef.current.on(
      'room_users',
      (data: { users: RoomUser[]; count: number }) => {
        setRoomUsers(data.users);
      }
    );

    socketRef.current.on('error', (error) => {
      setSnackbar({
        open: true,
        message: `Error: ${error}`,
        color: 'danger',
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // SEND MESSAGE
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    socketRef.current?.emit('send_message', {
      roomId: 'room1',
      message: inputMessage,
    });

    setInputMessage('');
  };

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#e5ddd5' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/*  HEADER */}
        <Sheet
          sx={{
            p: 2,
            bgcolor: '#075e54',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography level="h4">Chat Room</Typography>
            <Typography level="body-sm" sx={{ color: '#fff' }}>
              {roomUsers.length} online
            </Typography>
          </Box>
        </Sheet>

        {/* USERS */}
        <Sheet
          sx={{
            p: 1,
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            bgcolor: '#f0f0f0',
          }}
        >
          {roomUsers.map((user) => (
            <Chip
              key={user.socketId}
              size="sm"
              variant={user.name === currentUser ? 'solid' : 'soft'}
              color={user.name === currentUser ? 'success' : 'primary'}
            >
              {user.name} {user.name === currentUser && '(You)'}
            </Chip>
          ))}
        </Sheet>

        {/* MESSAGES */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          {messages.length === 0 ? (
            <Typography textAlign="center">
              Start chatting 
            </Typography>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.sender === currentUser;

              return (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    justifyContent: isMe ? 'flex-end' : 'flex-start',
                  }}
                >
                  {msg.isSystemMessage ? (
                    <Typography
                      level="body-xs"
                      sx={{ textAlign: 'center', width: '100%' }}
                    >
                      {msg.message}
                    </Typography>
                  ) : (
                    <Sheet
                      sx={{
                        p: 1.5,
                        borderRadius: 'lg',
                        maxWidth: '60%',
                        bgcolor: isMe ? '#25d366' : '#fff',
                        color: isMe ? '#000' : '#000',
                      }}
                    >
                      {!isMe && (
                        <Typography level="body-xs" fontWeight="bold">
                          {msg.sender}
                        </Typography>
                      )}

                      <Typography>{msg.message}</Typography>

                      <Typography
                        level="body-xs"
                        sx={{ textAlign: 'right', opacity: 0.6 }}
                      >
                        {formatTime(msg.timestamp)}
                      </Typography>
                    </Sheet>
                  )}
                </Box>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* INPUT */}
        <Sheet sx={{ p: 2, bgcolor: '#f0f0f0' }}>
          <Box
            component="form"
            onSubmit={handleSendMessage}
            sx={{ display: 'flex', gap: 1 }}
          >
            <Textarea
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              minRows={1}
              maxRows={3}
              sx={{ flex: 1 }}
            />
            <Button type="submit" disabled={!inputMessage.trim()}>
              Send 
            </Button>
          </Box>
        </Sheet>
      </Box>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        color={snackbar.color}
      >
        {snackbar.message}
      </Snackbar>
    </Box>
  );
};

export default Chat;