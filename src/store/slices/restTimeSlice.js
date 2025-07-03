import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "00:00 - 00:00",
};

const restTimeSlice = createSlice({
  name: "restTime",
  initialState,
  reducers: {
    resetRestTime: (state) => {
      state.value = initialState.value;
    },
    updateRestTime: (state, action) => {
      if (action.payload.start) {
        state.value = action.payload.time + state.value.slice(5);
      } else {
        state.value = state.value.slice(0, 8) + action.payload.time;
      }
    },
  },
});

export const { resetRestTime, updateRestTime } = restTimeSlice.actions;
export default restTimeSlice.reducer;
