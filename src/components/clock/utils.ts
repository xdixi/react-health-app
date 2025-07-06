const distributeClockNumbers = (
  containerSize: number,
  units: number
): [number, number][] => {
  const radius = containerSize / 2 - 15;
  const positions: [number, number][] = [];
  const step = 360 / units;

  for (let i = 0; i < units; i++) {
    const angle = i * step * (Math.PI / 180);
    const x = Math.round(radius * Math.sin(angle));
    const y = -Math.round(radius * Math.cos(angle));
    positions.push([x, y]);
  }

  return positions;
};

const calcAngles = (value: string): [number, number, number, number] => {
  const startH = Number(value.slice(0, 2));
  const startM = Number(value.slice(3, 5));
  const endH = Number(value.slice(8, 10));
  const endM = Number(value.slice(11, 13));

  const startAngleH = startH * 30;
  const startAngleM = startM * 6;
  const endAngleH = endH * 30;
  const endAngleM = endM * 6;

  return [startAngleH, startAngleM, endAngleH, endAngleM];
};

const formatLongDateInTable = (dataKey: string): [string, string, string] => {
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
  weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  return [date, month, weekday];
};

const switchMonthEnding = (month: string): string => {
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
      return month === "март" ? month + "а" : month;
    default:
      return "";
  }
};

const calcDegrees = (deg: number, step: number): number => {
  const k = Math.round(deg / step);
  return k * step;
};

export {
  distributeClockNumbers,
  calcAngles,
  formatLongDateInTable,
  calcDegrees,
};
