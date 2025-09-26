import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { Bill, DietDetail, Member, Notification } from "../../types/Gym";
import type { RootState } from "../../app/store";

interface MemberState {
  list: Member[];
  status: "idle" | "loading";
  notifications: Notification[];
  notifStatus: "idle" | "loading";
  // dashboard
  dashboardMember: Member | null;
  dashboardStats: { notificationsCount: number; billsCount: number } | null;
  dashboardBills: Bill[];
  dashboardDiets: DietDetail[];
  dashboardStatus: "idle" | "loading" | "failed";
}

const initialState: MemberState = {
  list: [],
  status: "idle",
  notifications: [],
  notifStatus: "idle",
  dashboardMember: null,
  dashboardStats: null,
  dashboardBills: [],
  dashboardDiets: [],
  dashboardStatus: "idle",
};

// ---- Thunks ----
export const fetchMembers = createAsyncThunk("member/fetchAll", async () => {
  const res = await api.get("/member");
  return res.data as Member[];
});

export const getMemberDashboard = createAsyncThunk<
  {
    member: Member;
    stats: { notificationsCount: number; billsCount: number; dietCount?: number };
    notifications: Notification[];
    bills: Bill[];
    dietPlans: DietDetail[];
  },
  void,
  { state: RootState; rejectValue: string }
>("member/dashboard", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token || localStorage.getItem("token");
    if (!token) return rejectWithValue("No auth token found");

    const res = await api.get("/member/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.msg || "Failed to load dashboard");
  }
});


export const fetchNotifications = createAsyncThunk("member/fetchNotifications", async () => {
  const res = await api.get("/member/notifications");
  return res.data as Notification[];
});

// ---- Slice ----
export const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    // members
    b.addCase(fetchMembers.pending, (s) => {
      s.status = "loading";
    });
    b.addCase(fetchMembers.fulfilled, (s, a: PayloadAction<Member[]>) => {
      s.list = a.payload;
      s.status = "idle";
    });

    // notifications
    b.addCase(fetchNotifications.pending, (s) => {
      s.notifStatus = "loading";
    });
    b.addCase(fetchNotifications.fulfilled, (s, a: PayloadAction<Notification[]>) => {
      s.notifications = a.payload;
      s.notifStatus = "idle";
    });

    // dashboard
    b.addCase(getMemberDashboard.pending, (s) => {
      s.dashboardStatus = "loading";
    });
    b.addCase(
      getMemberDashboard.fulfilled,
      (
        s,
        a: PayloadAction<{
          member: Member;
          stats: { notificationsCount: number; billsCount: number };
          notifications: Notification[];
          bills: Bill[];
          dietPlans: DietDetail[];
        }>
      ) => {
        s.dashboardMember = a.payload.member;
        s.dashboardStats = a.payload.stats;
        s.notifications = a.payload.notifications;
        s.dashboardBills = a.payload.bills;
        s.dashboardDiets = a.payload.dietPlans;
        s.dashboardStatus = "idle";
      }
    );
    b.addCase(getMemberDashboard.rejected, (s) => {
      s.dashboardStatus = "failed";
    });
  },
});

export default memberSlice.reducer;
