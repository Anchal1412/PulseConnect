
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, logout } from '../controllers/authController';
import { User } from '../models/User';
import Chat from './Chat';
import ChatIcon from '@mui/icons-material/Chat';
import RefreshIcon from '@mui/icons-material/Refresh';
import LogoutIcon from '@mui/icons-material/Logout';

import {
  Box,
  Typography,
  Button,
  Table,
  Sheet,
  Snackbar,
} from '@mui/joy';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    color: 'neutral' as 'neutral' | 'success' | 'danger',
  });
  const [ischatmode, setisChatMode] = useState(false);

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

  const handleLogout = async () => {
    try {
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
            <Button  startDecorator={<ChatIcon />} onClick={() => setisChatMode((prev) => !prev)}>
              {ischatmode ? 'Users Dashboard' : ' Chat'}
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
                    {users.map((user) => (
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
                              bgcolor: user.status ? '#d4edda' : '#f8d7da',
                              color: user.status ? '#155724' : '#721c24',
                            }}
                          >
                            {user.status ? '✓ Active' : '✗ Inactive'}
                          </Box>
                        </td>
                      </tr>
                    ))}
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
              <Chat />
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