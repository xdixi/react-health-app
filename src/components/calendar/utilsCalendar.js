const getWeek = (currDate = new Date()) => {
  const dayOfweek = currDate.getDay();
  const startOfWeek = new Date(currDate);
  startOfWeek.setDate(
    currDate.getDate() - (dayOfweek === 0 ? 6 : dayOfweek - 1)
  );
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return [startOfWeek, endOfWeek]; //  [Mon Jan 20 2025 02:27:56 GMT+0300 (Москва, стандартное время), Sun Jan 26 2025 02:27:56 GMT+0300 (Москва, стандартное время)]
};

const generateYearData = (startYear) => {
  let actualDate = new Date(startYear);
  let actualYear = [];

  for (let i = 0; i < 365; i++) {
    let day = actualDate.getDate();
    let month = actualDate.getMonth();
    let year = actualDate.getFullYear();
    let dateString = `${year}.${month + 1}.${day}`;

    const dayData = {
      [dateString]: {
        rest: "",
        preasure: "",
        wellBeing: "",
        pills: "",
        dayRating: "",
      },
    };

    actualYear.push(dayData);
    actualDate.setDate(actualDate.getDate() + 1);
  }

  return actualYear;
};

export { getWeek, generateYearData };
