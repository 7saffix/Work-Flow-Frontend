import { configureStore } from "@reduxjs/toolkit";
import userReduce from "./userSlice";
import productReducer from "./productSlice";
export const store = configureStore({
  reducer: {
    user: userReduce,
    products: productReducer,
  },
});
