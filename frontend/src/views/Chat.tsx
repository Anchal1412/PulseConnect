import React, { useState, useEffect, useRef } from 'react';
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
  socketIds: string[];
  userId: string;
  name: string;
}

interface ChatProps {
  socket: any;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  roomUsers: RoomUser[];
  currentUser: string;
}

const Chat: React.FC<ChatProps> = ({
  socket,
  messages,
  setMessages,
  roomUsers,
  currentUser,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [inputMessage, setInputMessage] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    color: 'neutral' as 'neutral' | 'success' | 'danger',
  });

  // RECEIVE MESSAGE
  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('connect', () => {
      setSnackbar({
        open: true,
        message: 'Connected to chat server',
        color: 'success',
      });
    });

    socket.on('disconnect', () => {
      setSnackbar({
        open: true,
        message: 'Disconnected from chat server',
        color: 'danger',
      });
    });

    socket.on('error', (error: any) => {
      setSnackbar({
        open: true,
        message: `Error: ${error}`,
        color: 'danger',
      });
    });

    return () => {
      socket.off('receive_message');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error');
    };
  }, [socket, setMessages]);

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // SEND MESSAGE
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    socket?.emit('send_message', {
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
    <Box sx={{ display: 'flex', height: '100%', flex: 1, bgcolor: '#e5ddd5' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
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
              key={user.userId}
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
            minHeight: 0,
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
                      {msg.sender === currentUser
                        ? msg.message.includes('joined')
                          ? 'You joined'
                          : msg.message.includes('left')
                          ? 'You left'
                          : msg.message
                        : msg.message.replace('the room', '')}
                    </Typography>
                  ) : (
                    <Sheet
                      sx={{
                        p: 1.5,
                        borderRadius: 'lg',
                        maxWidth: '60%',
                        bgcolor: isMe ? '#25d366' : '#fff',
                        color: '#000',
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