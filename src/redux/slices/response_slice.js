import { createSlice } from "@reduxjs/toolkit";

export const responseSlice = createSlice({
  name: "response",
  initialState: {
    loading: false,
  },
  reducers: {
    setBusy: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setBusy } = responseSlice.actions;
export default responseSlice.reducer;
