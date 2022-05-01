import { createSlice } from "@reduxjs/toolkit";

export const responseSlice = createSlice({
  name: "response",
  initialState: {
    loading: false,
    refresh: true,
  },
  reducers: {
    setBusy: (state, action) => {
      state.loading = action.payload;
    },
    setRefresh: (state) => {
      state.refresh = !state.refresh;
    },
  },
});

export const { setBusy, setRefresh } = responseSlice.actions;

export default responseSlice.reducer;
