const distributeClockNumbers = (containerSize, units) => {
  const radius = containerSize / 2 - 15;
  const positions = [];
  const step = 360 / units;

  for (let i = 0; i < units; i++) {
    const angle = i * step * (Math.PI / 180);
    const x = Math.round(radius * Math.sin(angle));
    const y = -Math.round(radius * Math.cos(angle));
    positions.push([x, y]);
  }

  return positions;
};

const calcAngles = (value) => {
  let startAngleH = 0,
    startAngleM = 0,
    endAngleH = 0,
    endAngleM = 0;
  let startH = 0,
    startM = 0,
    endH = 0,
    endM = 0;
  startH = value.slice(0, 2).startsWith("0")
    ? value.slice(1, 2)
    : value.slice(0, 2);
  startM = value.slice(3, 5).startsWith("0")
    ? value.slice(4, 5)
    : value.slice(3, 5);
  endH = value.slice(8, 10).startsWith("0")
    ? value.slice(9, 10)
    : value.slice(8, 10);
  endM = value.slice(11).startsWith("0") ? value.slice(12) : value.slice(11);
  startAngleH = startH * 30;
  startAngleM = startM * 6;
  endAngleH = endH * 30;
  endAngleM = endM * 6;
  return [startAngleH, startAngleM, endAngleH, endAngleM];
};

const formatLongDateInTable = (dataKey) => {
  const dateToCheck = new Date(Date.parse(dataKey)).toLocaleDateString(
    "ru-RU",
    {
      day: "2-digit",
    }
  );
  const date = dateToCheck.startsWith("0") ? dateToCheck.slice(1) : dateToCheck;
  let month = new Date(Date.parse(dataKey)).toLocaleDateString("ru-RU", {
    month: "long",
  });
  month = switchMonthEnding(month);
  let weekday = new Date(Date.parse(dataKey)).toLocaleDateString("ru-RU", {
    weekday: "long",
  });
  weekday = weekday.slice(0, 1).toUpperCase() + weekday.slice(1);
  return [date, month, weekday];
};

const switchMonthEnding = (month) => {
  switch (true) {
    case [
      "январь",
      "февраль",
      "апрель",
      "май",
      "июнь",
      "июль",
      "сентябрь",
      "октябрь",
      "ноябрь",
      "декабрь",
    ].includes(month):
      return month.slice(0, month.length - 1) + "я";
    case month === "март" || month === "августа":
      return month === "март" ? month + "a" : month;
    default:
      return "";
  }
};

const calcDegrees = (deg, step) => {
  let k = Math.round(deg / step);
  return k * step;
};

export {
  distributeClockNumbers,
  calcAngles,
  formatLongDateInTable,
  calcDegrees,
};
