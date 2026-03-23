import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, logout } from '../controllers/authController';
import { User } from '../models/User';

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
          <Typography level="h2">Users Dashboard</Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button onClick={handleRefresh}>
              🔄 Refresh
            </Button>

            <Button color="danger" onClick={handleLogout}>
              🚪 Logout
            </Button>
          </Box>
        </Box>

        {/* Table */}
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
      </Sheet>

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