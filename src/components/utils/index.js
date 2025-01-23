function getWeek(currDate = new Date()) {
  const dayOfweek = currDate.getDay();
  const startOfWeek = new Date(currDate);
  startOfWeek.setDate(
    currDate.getDate() - (dayOfweek === 0 ? 6 : dayOfweek - 1)
  );
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return [startOfWeek, endOfWeek];
}

export { getWeek };
