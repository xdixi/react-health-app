import { configureStore } from "@reduxjs/toolkit";
import restTimeReducer from "./slices/restTimeSlice";

export const store = configureStore({
  reducer: {
    restTime: restTimeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
