// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'member' | 'user';
}

interface AuthState {
  token: string | null;
  user: User | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (creds: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', creds);
      console.log("login response:", res.data);

      // 🔹 adjust mapping depending on backend
      const user: User = {
        id: res.data.user?._id ?? res.data._id,
        username: res.data.user?.username ?? res.data.username,
        role: res.data.user?.role ?? res.data.role,
      };

      return { token: res.data.token, user };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('auth');
    },
    restoreSession(state) {
      const saved = localStorage.getItem('auth');
      if (saved) {
        const parsed = JSON.parse(saved) as AuthState;
        state.token = parsed.token;
        state.user = parsed.user;
        state.status = 'idle';
        state.error = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.status = 'idle';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;

        localStorage.setItem(
          'auth',
          JSON.stringify({ token: state.token, user: state.user, status: state.status })
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Login failed';
      });
  },
});

export const { logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
