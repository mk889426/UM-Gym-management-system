// src/features/member/memberSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';

interface Member { id: string; name: string; membershipType: string }
interface MemberState { list: Member[]; status: 'idle'|'loading' }

const initialState: MemberState = { list: [], status: 'idle' };

export const fetchMembers = createAsyncThunk(
  'member/fetchAll',
  async () => {
    const res = await api.get('/member');
    return res.data as Member[];
  }
);

export const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchMembers.pending, (s) => { s.status = 'loading' });
    b.addCase(fetchMembers.fulfilled, (s, a) => {
      s.list = a.payload;
      s.status = 'idle';
    });
  }
});

export default memberSlice.reducer;