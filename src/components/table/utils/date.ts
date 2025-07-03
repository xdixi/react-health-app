import type { DayData, WeekData } from "../types";

const getCurrentWeek = (week: string): WeekData => {
  const currentYear = new Date().getFullYear();

  const storedJson = localStorage.getItem(`yearData${currentYear}`);
  if (!storedJson) return [];

  const storedData: DayData[] = JSON.parse(storedJson); // возможно 'Data${currentYear}'

  const [start, end] = week.split("-");

  const startDate = new Date(start);
  const endDate = new Date(end);

  const currentWeek = storedData.filter((day) => {
    const dateKey = Object.keys(day)[0]; // <-- достаём строку
    const currentDay = new Date(dateKey.replace(/\./g, "-"));

    return currentDay >= startDate && currentDay <= endDate;
  });

  return currentWeek;
};

const formatDateInTable = (dataKey: string): string[] => {
  const timestamp = Date.parse(dataKey);
  if (isNaN(timestamp)) {
    throw new Error(`Invalid date string: ${dataKey}`);
  }

  const dateObj = new Date(timestamp);

  const dayRaw = dateObj.toLocaleDateString("ru-RU", {
    day: "2-digit",
  });
  const day = dayRaw.startsWith("0") ? dayRaw.slice(1) : dayRaw;

  const month = dateObj
    .toLocaleDateString("ru-RU", { month: "short" })
    .slice(0, 3);

  const weekday = dateObj.toLocaleDateString("ru-RU", { weekday: "short" });

  return [day, month, weekday];
};

export { getCurrentWeek, formatDateInTable };
