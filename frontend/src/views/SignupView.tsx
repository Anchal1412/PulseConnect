import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../controllers/authController';

import {
  Box,
  Typography,
  Input,
  Button,
  Sheet,
  Snackbar,
} from '@mui/joy';

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    color: 'neutral' as 'neutral' | 'success' | 'danger',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(form);
      setSnackbar({
        open: true,
        message: 'Signup successful. You can now log in.',
        color: 'success',
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || 'Signup failed',
        color: 'danger',
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Sheet
        sx={{
          width: '100%',
          maxWidth: 520,
          p: 4,
          borderRadius: '20px',
          boxShadow: 'lg',
          backdropFilter: 'blur(14px)',
        }}
      >
        <Typography
          level="h2"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 700,
          }}
        >
          Create Account
        </Typography>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'grid',
            gap: 2,
          }}
        >
          <Input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
          />

          <Input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <Input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            size="lg"
            sx={{
              mt: 1,
              fontWeight: 700,
              background:
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              },
            }}
          >
            Signup
          </Button>
        </Box>

        {/* Footer */}
        <Typography
          sx={{
            textAlign: 'center',
            mt: 2,
          }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#5469f2',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Login
          </Link>
        </Typography>
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

export default Signup;