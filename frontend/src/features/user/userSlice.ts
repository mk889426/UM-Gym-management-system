import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"
import api from "../../api/axios"

export const fetchUserDetails = createAsyncThunk(
  "user/details",
  async (_, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token || localStorage.getItem("token")

    if (!token) {
      throw new Error("No auth token found")
    }

    const res = await api.get("/user/details", {
      headers: { Authorization: `Bearer ${token}` },
    })

    return res.data
  }
)

const userSlice = createSlice({
  name: "user",
  initialState: {
    details: null as any,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false
        state.details = action.payload
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to load user"
      })
  },
})

export default userSlice.reducer
