import { configureStore } from "@reduxjs/toolkit";
import responseReducer from "./slice/response_slice";
import serviceProductReducer from "./slice/service_product_slice";
import userReducer from "./slice/user_slice";
// import use from "./slice/user_slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    response: responseReducer,
    service_product: serviceProductReducer,
  },
});
