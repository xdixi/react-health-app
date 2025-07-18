const SELECTED_WEEK_KEY = "selectedWeek";

export const saveSelectedWeek = (value: Date[]): void => {
  sessionStorage.setItem(SELECTED_WEEK_KEY, JSON.stringify(value));
};

export const loadSelectedWeek = (): [Date, Date] | null => {
  const stored = sessionStorage.getItem(SELECTED_WEEK_KEY);

  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length === 2
      ? [new Date(parsed[0]), new Date(parsed[1])]
      : null;
  } catch {
    return null;
  }
};
