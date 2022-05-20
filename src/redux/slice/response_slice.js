import { createSlice } from "@reduxjs/toolkit";

export const responseSlice = createSlice({
  name: "response",
  initialState: {
    loading: false,
    refresh: true,
    project: null,
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
  },
});

export const { setBusy, setRefresh, setProject } = responseSlice.actions;

export default responseSlice.reducer;
