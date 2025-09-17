// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { jwtDecode } from "jwt-decode";


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

interface LoginPayload {
  username: string
  password: string
  role: "admin" | "user"
}

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password, role }: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", { username, password, role })
      const token = res.data.token

      // 🔹 decode payload from token
      const decoded = jwtDecode<User>(token)

      const user: User = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      }

      // 🚨 Role enforcement
      if (role === "admin" && user.role !== "admin") {
        return rejectWithValue("Only admins can log in here")
      }
      if (role === "user" && user.role === "admin") {
        return rejectWithValue("Admins must log in through the admin portal")
      }

      return { token, user }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed")
    }
  }
)
export const register = createAsyncThunk(
  "auth/register",
  async (creds: { username: string; password: string; role?: 'admin' | 'user' }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", creds);
      const token = res.data.token;
      const user = res.data.user as User;

      return { token, user };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
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
      })

      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.status = 'idle';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
        localStorage.setItem('auth', JSON.stringify({ token: state.token, user: state.user, status: state.status }));
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Registration failed';
      });
  },
});

export const { logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
