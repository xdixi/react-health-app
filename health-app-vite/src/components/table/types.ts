export type DayData = {
  rest: string;
  pressureAndPulse: string;
  wellBeing: string;
  pills: string;
  dayRating: string;
};

export type DayDataKeys = keyof DayData;

export type DayEntry = {
  [date: string]: DayData;
};

export type WeekData = DayEntry[];

export type WeekDay = {
  [date: string]: DayData;
};

// type DayData = {
//   [key in MoodKey]?: string;
// };
