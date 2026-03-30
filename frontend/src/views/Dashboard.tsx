
import React, { useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, logout } from '../controllers/authController';
import { User } from '../models/User';
import Chat from './Chat';
import ChatIcon from '@mui/icons-material/Chat';
import RefreshIcon from '@mui/icons-material/Refresh';
import LogoutIcon from '@mui/icons-material/Logout';
import { io, Socket } from 'socket.io-client';

import {
  Box,
  Typography,
  Button,
  Table,
  Sheet,
  Snackbar,
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

const Dashboard: React.FC = () => {
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    color: 'neutral' as 'neutral' | 'success' | 'danger',
  });
  const [ischatmode, setisChatMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const data = await fetchUsers(token);
        setUsers(data);
      } catch (err: any) {
        if (err.message?.toLowerCase().includes('unauthorized')) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        setSnackbar({
          open: true,
          message: err.message,
          color: 'danger',
        });
      }
    };

    loadUsers();
  }, [navigate]);
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
      socketRef.current?.onAny((event, data) => {
  console.log('EVENT:', event, data);
});
  
      socketRef.current.on('connect', () => {
        // setSnackbar({
        //   open: true,
        //   message: 'Connected to chat server',
        //   color: 'success',
        // });
  
        socketRef.current?.emit('join_room', { roomId: 'room1' });
      });
  
      socketRef.current.on('disconnect', () => {
        setSnackbar({
          open: true,
          message: 'Disconnected from chat server',
          color: 'danger',
        });
      });
  
      // socketRef.current.on('receive_message', (data: Message) => {
      //   setMessages((prev) => [...prev, data]);
      // });
  
      socketRef.current.on(
        'room_users',
        (data: { users: RoomUser[]; count: number }) => {
          setRoomUsers(data.users);
        }
      );
      socketRef.current.on('online_users', (users: any[]) => {
        const ids = users.map((u) => u.userId);
        setOnlineUsers(ids);
      });
  
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

  const handleLogout = async () => {
    try {
      socketRef.current?.emit('leave_room', { roomId: 'room1' });
      const token = localStorage.getItem('token') || '';
      await logout(token);
      localStorage.removeItem('token');
      navigate('/');
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message,
        color: 'danger',
      });
    }
  };

  const handleRefresh = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const data = await fetchUsers(token);
        setUsers(data);
        setSnackbar({
          open: true,
          message: 'Users refreshed successfully',
          color: 'success',
        });
      } catch {
        setSnackbar({
          open: true,
          message: 'Failed to refresh users',
          color: 'danger',
        });
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 3,
      }}
    >
      <Sheet
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          p: 3,
          borderRadius: '20px',
          boxShadow: 'lg',
          position: 'relative', 
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography level="h2">
            {ischatmode ? 'Chat' : 'Users Dashboard'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startDecorator={<ChatIcon />}
              onClick={() => {
                setisChatMode((prev) => !prev); 
                if (!ischatmode) {
                  setSnackbar({
                    open: true,
                    message: 'Connected to chat server',
                    color: 'success',
                  });
                }
              }}
            >
              {ischatmode ? 'Users Dashboard' : 'Chat'}
            </Button>

            <Button  startDecorator={<RefreshIcon />} onClick={handleRefresh}>
               Refresh
            </Button>

            <Button  startDecorator={<LogoutIcon />} color="danger" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>

        {/* CONTENT WRAPPER */}
        <Box sx={{ position: 'relative' }}>
          
          {/* Dashboard Content */}
          <Box
            sx={{
              visibility: ischatmode ? 'hidden' : 'visible',
            }}
          >
            {users.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography>No users found.</Typography>
              </Box>
            ) : (
              <Sheet variant="outlined" sx={{ overflow: 'auto' }}>
                <Table hoverRow>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                      
                    {users.map((user) => {
                      const isOnline = onlineUsers.some((id)=> String(id) === String (user._id));
                      return (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <Box
                              sx={{
                                display: 'inline-block',
                                px: 1.5,
                                py: 0.5,
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              bgcolor: isOnline ? '#d4edda' : '#f8d7da',
                              color: isOnline ? '#155724' : '#721c24',
                            }}
                          >
                            {isOnline ? 'Online' : 'Offline'}
                          </Box>
                        </td>
                      </tr>
                    );
                  })}
                  </tbody>
                </Table>
              </Sheet>
            )}
          </Box>

          {/* Chat Overlay */}
          {ischatmode && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            >
              <Chat 
              socket = {socketRef.current}
              messages = {messages}
              setMessages = {setMessages}
              roomUsers = {roomUsers}
              currentUser = {currentUser}
              />
            </Box>
          )}
        </Box>
      </Sheet>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        color={snackbar.color}
        variant="soft"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {snackbar.message}
      </Snackbar>
    </Box>
  );
};

export default Dashboard;