import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      const { payload } = action;
      state.user = payload === null ? null : { ...payload };
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
