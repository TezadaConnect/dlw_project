import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
  name: "product",
  initialState: {
    product: [],
    currentRequest: null,
  },
  reducers: {
    setProduct: (state, action) => {
      const arrHolder = [];
      let arrRateHolder = [];
      const { payload } = action;
      payload.map((item) => {
        item.rate.map((rate) => {
          arrRateHolder.push(JSON.parse(rate));
        });
        arrHolder.push({ ...item, rate: [...arrRateHolder] });
        arrRateHolder = [];
      });
      state.product = payload === null ? [] : [...arrHolder];
    },
    setCurrentRequest: (state, action) => {
      state.currentRequest = action.payload;
    },
  },
});

export const { setProduct, setCurrentRequest } = productSlice.actions;
export default productSlice.reducer;
