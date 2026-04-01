import axios from 'axios';
import { AuthResponse, LoginPayload, SignupPayload, User } from '../models/User';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function signup(payload: SignupPayload): Promise<User> {
  try {
    const response = await api.post('/signup', payload);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Signup failed'
    );
  }
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await api.post('/login', payload);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Login failed'
    );
  }
}

export async function fetchUsers(token: string): Promise<User[]> {
  try {
    const response = await api.get('/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch users'
    );
  }
}
export async function logout(token: string): Promise<void> {
  try {
    await api.post(
      '/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Logout failed'
    );
  }
}