import { createSlice } from "@reduxjs/toolkit";

export const responseSlice = createSlice({
  name: "response",
  initialState: {
    loading: false,
    refresh: true,
    project: null,
    unreadNotificationCount: 0,
    unreadStatus: false,
    readStatus: false,
  },

  reducers: {
    setBusy: (state, action) => {
      state.loading = action.payload;
    },
    setRefresh: (state) => {
      state.refresh = !state.refresh;
    },
    setProject: (state, action) => {
      state.project = action.payload;
    },
    setUnreadNotificationCount: (state, action) => {
      state.unreadNotificationCount = action.payload;
    },
    setUnreadStatus: (state) => {
      state.unreadStatus = !state.unreadStatus;
    },
    setReadStatus: (state, action) => {
      state.readStatus = action.payload;
    },
  },
});

export const {
  setBusy,
  setRefresh,
  setProject,
  setUnreadNotificationCount,
  setUnreadStatus,
  setReadStatus,
} = responseSlice.actions;
export default responseSlice.reducer;
