// src/features/admin/adminSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import api from "../../api/axios";
import type { Bill, Member } from "../../types/Gym";


interface AdminState {
  member: Member | null
  members: Member[]
  bills: Bill[]   // ✅ add bills
  loading: boolean
  error: string | null
}

interface PromoteMemberPayload {
  username: string;
  name: string;
  contact: string;
  address: string;
  feePackage?: string;
  joinDate?: string;
}


// ✅ Fetch all members
export const fetchMembers = createAsyncThunk<Member[], void, { state: RootState }>(
  "admin/fetchMembers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem("token");

      if (!token) {
        throw new Error("No auth token found");
      }

      const res = await api.get("/admin/members", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.members as Member[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.msg || error.message || "Failed to fetch members");
    }
  }
);

// ✅ Promote a user to member
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


// ✅ Update existing member
export const updateMember = createAsyncThunk<
  Member,
  { id: string; updates: Partial<Member> },
  { state: RootState }
>(
  "admin/updateMember",
  async ({ id, updates }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem("token");

      if (!token) {
        throw new Error("No auth token found");
      }

      const res = await api.put(`/admin/members/${id}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data as Member;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.msg || error.message || "Failed to update member");
    }
  }
);

// ✅ Delete existing member
export const deleteMember = createAsyncThunk<
  string,
  string,
  { state: RootState }
>(
  "admin/deleteMember",
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem("token");

      if (!token) throw new Error("No auth token found");

      await api.delete(`/admin/members/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return id; // return deleted member id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.msg || error.message || "Failed to delete member");
    }
  }
);



export const fetchBills = createAsyncThunk<Bill[], void, { state: RootState }>(
  "admin/fetchBills",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const token = state.auth.token || localStorage.getItem("token")
      if (!token) throw new Error("No auth token found")

      const res = await api.get("/admin/bills", {
        headers: { Authorization: `Bearer ${token}` },
      })

      return res.data as Bill[]
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.msg || error.message || "Failed to fetch bills")
    }
  }
)

// ✅ Create a new bill
export const createBill = createAsyncThunk<
  Bill,
  { memberId: string; amount: number; date: string; status?: string },
  { state: RootState }
>("admin/createBill", async (payload, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    const token = state.auth.token || localStorage.getItem("token")
    if (!token) throw new Error("No auth token found")

    const res = await api.post("/admin/bills", payload, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return res.data as Bill
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.msg || error.message || "Failed to create bill")
  }
})


// ✅ Update bill status
export const updateBillStatus = createAsyncThunk<
  Bill,
  { id: string; status: "paid" | "pending" },
  { state: RootState }
>("admin/updateBillStatus", async (payload, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    const token = state.auth.token || localStorage.getItem("token")
    if (!token) throw new Error("No auth token found")

    const res = await api.put(`/admin/bills/${payload.id}/status`, { status: payload.status }, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return res.data as Bill
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.msg || error.message || "Failed to update bill status")
  }
})




const initialState: AdminState = {
  member: null,
  members: [],                // ✅ Initialize members list
  bills: [],
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
      // ✅ fetchMembers cases
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action: PayloadAction<Member[]>) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ promoteToMember cases
      .addCase(promoteToMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(promoteToMember.fulfilled, (state, action: PayloadAction<Member>) => {
        state.loading = false;
        state.member = action.payload;
        state.members.push(action.payload); // Add new member to members list
      })
      .addCase(promoteToMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ updateMember cases
      .addCase(updateMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMember.fulfilled, (state, action: PayloadAction<Member>) => {
        state.loading = false;
        state.member = action.payload;
        // Update members array in-place
        const index = state.members.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) {
          state.members[index] = action.payload;
        }
      })
      .addCase(updateMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ deleteMember cases
      .addCase(deleteMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMember.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.members = state.members.filter((m) => m._id !== action.payload);
        if (state.member?._id === action.payload) state.member = null;
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //fetch bills
      .addCase(fetchBills.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBills.fulfilled, (state, action: PayloadAction<Bill[]>) => {
        state.loading = false
        state.bills = action.payload
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      //create bill
      .addCase(createBill.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBill.fulfilled, (state, action: PayloadAction<Bill>) => {
        state.loading = false
        state.bills.unshift(action.payload) // add new bill to top
      })
      .addCase(createBill.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // update bill status
      .addCase(updateBillStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateBillStatus.fulfilled, (state, action: PayloadAction<Bill>) => {
        state.loading = false
        const updatedBill = action.payload
        const index = state.bills.findIndex(b => b.id === updatedBill.id)
        if (index !== -1) {
          state.bills[index] = updatedBill // replace the old one
        }
      })
      .addCase(updateBillStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })




  },
});

export const { clearMember } = adminSlice.actions;
export default adminSlice.reducer;
