// src/features/admin/adminSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import api from "../../api/axios";

interface Member {
  _id: string;
  user: string;
  name: string;
  contact: string;
  address: string;
  feePackage: string;
}

interface AdminState {
  member: Member | null;
  loading: boolean;
  error: string | null;
}

interface PromoteMemberPayload {
  username: string;
  name: string;
  contact: string;
  address: string;
  feePackage?: string;
}

export const promoteToMember = createAsyncThunk<
  Member,
  PromoteMemberPayload,
  { state: RootState }
>(
  "admin/promoteToMember",
  async (memberData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem("token");

      if (!token) {
        throw new Error("No auth token found");
      }

      const res = await api.post("/admin/members", memberData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.member as Member;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.msg || error.message || "Failed to promote member");
    }
  }
);

const initialState: AdminState = {
  member: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearMember(state) {
      state.member = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(promoteToMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(promoteToMember.fulfilled, (state, action: PayloadAction<Member>) => {
        state.loading = false;
        state.member = action.payload;
      })
      .addCase(promoteToMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMember } = adminSlice.actions;
export default adminSlice.reducer;
