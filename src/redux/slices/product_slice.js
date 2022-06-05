import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
  name: "product",
  initialState: {
    product: [],
    topProduct: [],
    currentRequest: null,
    time: 0,
    counter: 0,
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
    setCounter: (state) => {
      const status = state.currentRequest?.status;
      state.counter = parseInt(getValueOfStatus(status));
    },
    setTopProduct: (state, action) => {
      const { payload } = action;
      const arrHolder = [];
      const count = {};
      payload.forEach((element) => {
        arrHolder.push(element.service_type);
      });

      arrHolder.forEach((element) => {
        count[element] = (count[element] || 0) + 1;
      });

      const sortedList = [];

      Object.keys(count)
        .sort((a, b) => count[a] - count[b])
        .forEach((key) => {
          sortedList.push([key, count[key]]);
        });

      console.log(sortedList);

      let final_list = [];

      if (sortedList.length <= 3) {
        final_list = sortedList;
      }
      if (sortedList.length > 3) {
        final_list = sortedList.slice(sortedList.length - 3);
      }

      const listOfTopProducts = [];

      final_list.forEach((element) => {
        state.product.forEach((data) => {
          if (data.id === element[0]) {
            listOfTopProducts.push({ ...data, count: element[1] });
          }
        });
      });

      state.topProduct = listOfTopProducts.reverse();
    },
    setTime: (state, action) => {
      state.time = action.payload;
    },
  },
});

const getValueOfStatus = (status = null) => {
  const stateOfItem = status ?? null;
  if (stateOfItem === null) return 0;
  if (stateOfItem === PICKUP[0]) return 0;
  if (stateOfItem === PICKUP[1]) return 1;
  if (stateOfItem === PICKUP[8]) return 3;
  if (stateOfItem === PICKUP[9]) return 4;
  if (stateOfItem === PICKUP[2]) return 5;
  return 2;
};

const PICKUP = [
  "WAITING",
  "PICKUP",
  "REJECT",
  "WASH",
  "HANDWASH",
  "DRY",
  "IRON",
  "FOLD",
  "DELIVERY",
  "DONE",
];

export const {
  setProduct,
  setCurrentRequest,
  setTopProduct,
  setTime,
  setCounter,
} = productSlice.actions;
export default productSlice.reducer;
