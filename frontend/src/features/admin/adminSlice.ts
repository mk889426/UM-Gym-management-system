// src/features/admin/adminSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import api from "../../api/axios";
import type { Bill, DietDetail, Member, Supplement } from "../../types/Gym";


interface AdminState {
  member: Member | null
  members: Member[]
  bills: Bill[]
  notifications: Notification[]
  supplements: Supplement[]
  dietDetails: DietDetail[]
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


export const assignNotification = createAsyncThunk<
  Notification, // return type
  { memberId: string; message: string; date: string }, // argument type
  { state: RootState; rejectValue: string }
>(
  "notifications/assignNotification",
  async ({ memberId, message, date }, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const token = state.auth.token || localStorage.getItem("token")

      if (!token) {
        return rejectWithValue("No auth token found")
      }

      const res = await api.post(
        "/admin/notifications",
        { memberId, message, date },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      return res.data
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.msg || err.message || "Failed to assign notification"
      )
    }
  }
)


// ✅ Create a new supplement
export const createSupplement = createAsyncThunk<
  Supplement,
  { name: string; price: number; stock?: number },
  { state: RootState }
>("admin/createSupplement", async (payload, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    const token = state.auth.token || localStorage.getItem("token")
    if (!token) throw new Error("No auth token found")

    const res = await api.post("/admin/supplements", payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data as Supplement
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.msg || error.message || "Failed to create supplement")
  }
})

// ✅ List supplements
export const listSupplements = createAsyncThunk<
  Supplement[],
  void,
  { state: RootState }
>("admin/listSupplements", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    const token = state.auth.token || localStorage.getItem("token")
    if (!token) throw new Error("No auth token found")

    const res = await api.get("/admin/supplements", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data as Supplement[]
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.msg || error.message || "Failed to fetch supplements")
  }
})


// ✅ Update Supplement
export const updateSupplement = createAsyncThunk<
  Supplement,
  { id: string; name?: string; price?: number; stock?: number },
  { state: RootState }
>("admin/updateSupplement", async ({ id, ...payload }, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    const token = state.auth.token || localStorage.getItem("token")
    if (!token) throw new Error("No auth token found")

    const res = await api.put(`/admin/supplements/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data as Supplement
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.msg || error.message || "Failed to update supplement")
  }
})

// ✅ Delete Supplement
export const deleteSupplement = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("admin/deleteSupplement", async (id, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    const token = state.auth.token || localStorage.getItem("token")
    if (!token) throw new Error("No auth token found")

    const res = await api.delete(`/admin/supplements/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return id // return the deleted id for reducer to remove
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.msg || error.message || "Failed to delete supplement")
  }
})

// CREATE
export const createDietDetail = createAsyncThunk<
  DietDetail,
  { memberId: string; dietPlan: string },
  { state: RootState }
>("admin/createDietDetail", async (payload, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = state.auth.token || localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const res = await api.post("/admin/diet-details", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      id: res.data._id,
      memberId: res.data.member._id,
      memberName: res.data.member.name,
      dietPlan: res.data.dietPlan,
      createdDate: res.data.createdAt,
    } as DietDetail;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.msg || error.message || "Failed to create diet detail"
    );
  }
});

// UPDATE
export const updateDietDetail = createAsyncThunk<
  DietDetail,
  { id: string; dietPlan: string },
  { state: RootState }
>("admin/updateDietDetail", async (payload, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = state.auth.token || localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const res = await api.put(`/admin/diet-details/${payload.id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      id: res.data._id,
      memberId: res.data.member._id,
      memberName: res.data.member.name,
      dietPlan: res.data.dietPlan,
      createdDate: res.data.createdAt,
    } as DietDetail;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.msg || error.message || "Failed to update diet detail"
    );
  }
});

// DELETE
export const deleteDietDetail = createAsyncThunk<
  string, // just return deleted id
  string,
  { state: RootState }
>("admin/deleteDietDetail", async (id, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = state.auth.token || localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    await api.delete(`/admin/diet-details/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.msg || error.message || "Failed to delete diet detail"
    );
  }
});





const initialState: AdminState = {
  member: null,
  members: [],
  bills: [],
  notifications: [],
  supplements: [],
  dietDetails:[],
  loading: false,
  error: null,
}

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


      .addCase(assignNotification.pending, (state) => {
        state.loading = true
        state.error = null
      })
      // Fulfilled
      .addCase(
        assignNotification.fulfilled,
        (state, action: PayloadAction<Notification>) => {
          state.loading = false
          state.notifications.push(action.payload) // add new notification
        }
      )
      // Rejected
      .addCase(assignNotification.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })


      .addCase(createSupplement.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createSupplement.fulfilled, (state, action: PayloadAction<Supplement>) => {
        state.loading = false
        state.supplements.unshift(action.payload) // add new supplement to top
      })
      .addCase(createSupplement.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // ✅ List Supplements
      .addCase(listSupplements.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(listSupplements.fulfilled, (state, action: PayloadAction<Supplement[]>) => {
        state.loading = false
        state.supplements = action.payload
      })
      .addCase(listSupplements.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })


      .addCase(updateSupplement.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateSupplement.fulfilled, (state, action: PayloadAction<Supplement>) => {
        state.loading = false
        const index = state.supplements.findIndex((s) => s._id === action.payload._id)
        if (index !== -1) {
          state.supplements[index] = action.payload
        }
      })
      .addCase(updateSupplement.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(deleteSupplement.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteSupplement.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.supplements = state.supplements.filter((s) => s._id !== action.payload)
      })
      .addCase(deleteSupplement.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(createDietDetail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createDietDetail.fulfilled, (state, action: PayloadAction<DietDetail>) => {
        state.loading = false
        state.dietDetails.unshift(action.payload)
      })
      .addCase(createDietDetail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(updateDietDetail.fulfilled, (state, action: PayloadAction<DietDetail>) => {
        state.loading = false
        const idx = state.dietDetails.findIndex((d) => d.id === action.payload.id)
        if (idx !== -1) state.dietDetails[idx] = action.payload
      })

      .addCase(deleteDietDetail.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.dietDetails = state.dietDetails.filter((d) => d.id !== action.payload)
      })

  },
});

export const { clearMember } = adminSlice.actions;
export default adminSlice.reducer;
