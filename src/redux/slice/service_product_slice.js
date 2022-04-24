import { createSlice } from "@reduxjs/toolkit";

export const serviceProductSlice = createSlice({
  name: "service_product",
  initialState: {
    walk_in: {
      data: {
        request: [
          { id: `1`, price: "200", content: `Lorem ipsum donor` },
          { id: `2`, price: "230", content: `Lorem ipsum donor` },
        ],
        clean: [{ id: `4`, price: "503", content: `Lorem ipsum donor` }],
        done: [{ id: `5`, price: "349", content: `Lorem ipsum donor` }],
      },
    },
    pick_up: {
      data: {
        request: [
          { id: `1`, price: "200", content: `Lorem ipsum donor` },
          { id: `2`, price: "230", content: `Lorem ipsum donor` },
        ],
        clean: [{ id: `4`, price: "503", content: `Lorem ipsum donor` }],
        done: [{ id: `5`, price: "349", content: `Lorem ipsum donor` }],
      },
    },
  },
  reducers: {
    setWalkInData: (state, action) => {
      state.walk_in.data = action.payload;
    },
    setPickUpData: (state, action) => {
      state.pick_up.data = action.payload;
    },
  },
});

export const { setWalkInData, setPickUpData } = serviceProductSlice.actions;

export default serviceProductSlice.reducer;
