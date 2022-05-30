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
    graphData: [],
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
    setGraphData: (state, action) => {
      state.graphData = action.payload;
    },
  },
});

export const { setWalkInData, setPickUpData, setProduct, setGraphData } =
  serviceProductSlice.actions;

export default serviceProductSlice.reducer;
