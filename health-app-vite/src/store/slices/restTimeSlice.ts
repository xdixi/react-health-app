import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Time = `${string}:${string}`;
type TimeRange = `${Time} - ${Time}`;

type RestTimeState = {
  value: TimeRange;
};

const initialState: RestTimeState = {
  value: "00:00 - 00:00",
};

const restTimeSlice = createSlice({
  name: "restTime",
  initialState,
  reducers: {
    setRestTime(state, action: PayloadAction<TimeRange>) {
      state.value = action.payload;
    },
    resetRestTime(state) {
      state.value = "00:00 - 00:00";
    },
  },
});

export const { setRestTime, resetRestTime } = restTimeSlice.actions;

export default restTimeSlice.reducer;
