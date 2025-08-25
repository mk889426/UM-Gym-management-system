// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

interface AuthState {
  token: string | null;
  user: { id: string; name: string } | null;
  status: 'idle'|'loading'|'failed';
}

const initialState: AuthState = {
  token: null,
  user: null,
  status: 'idle',
};

export const login = createAsyncThunk(
  'auth/login',
  async (creds: { email: string; password: string }) => {
    const res = await api.post('/auth/login', creds);
    return res.data as { token: string; user: { id: string; name: string } };
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { logout(state) {
      state.token = null;
      state.user = null;
    }
  },
  extraReducers: (b) => {
    b.addCase(login.pending, (s) => { s.status = 'loading' });
    b.addCase(login.fulfilled, (s, a) => {
      s.status = 'idle';
      s.token = a.payload.token;
      s.user = a.payload.user;
    });
    b.addCase(login.rejected, (s) => { s.status = 'failed' });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;