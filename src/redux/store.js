import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user_slice";
import responseReducer from "./slices/response_slice";
import productReducer from "./slices/product_slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    response: responseReducer,
    product: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
