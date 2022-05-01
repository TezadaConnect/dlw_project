import { createSlice } from "@reduxjs/toolkit";

export const serviceProductSlice = createSlice({
  name: "service_product",
  initialState: {
    walk_in: {
      data: {
        request: [],
        clean: [],
        done: [],
      },
    },
    pick_up: {
      data: {
        request: [],
        clean: [],
        done: [],
      },
    },

    products: [],
  },
  reducers: {
    setWalkInData: (state, action) => {
      state.walk_in.data = action.payload;
    },
    setPickUpData: (state, action) => {
      state.pick_up.data = action.payload;
    },
    setProduct: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { setWalkInData, setPickUpData, setProduct } =
  serviceProductSlice.actions;

export default serviceProductSlice.reducer;
