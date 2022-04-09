import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user_slice";
import responseReducer from "./slices/response_slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    response: responseReducer,
  },
});

export default store;
