import { configureStore } from "@reduxjs/toolkit";
import restTimeReducer from "./slices/restTimeSlice";

export const store = configureStore({
  reducer: {
    restTime: restTimeReducer,
  },
});

export default store;
