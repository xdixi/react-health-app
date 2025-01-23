function setPositionButtonInTextarea(key) {
  switch (key) {
    case "rest":
      return { left: "115px" };
    case "pressure":
      return { left: "81px" };
    case "afterWhichMeasured":
      return { left: "113px" };
    case "wellBeing":
      return { left: "146px" };
    case "pills":
      return { left: "81px" };
    default:
      return { left: "" };
  }
}

const formatDateInTable = (dataKey) => {
  const dateToCheck = new Date(Date.parse(dataKey)).toLocaleDateString(
    "ru-RU",
    {
      day: "2-digit",
    }
  );
  const date = dateToCheck.startsWith("0") ? dateToCheck.slice(1) : dateToCheck;
  const month = new Date(Date.parse(dataKey))
    .toLocaleDateString("ru-RU", {
      month: "short",
    })
    .slice(0, 3);
  const weekday = new Date(Date.parse(dataKey)).toLocaleDateString("ru-RU", {
    weekday: "short",
  });

  return [date, month, weekday];
};

function averageSleepDuration(currWeek) {
  let sleepHours = [];
  currWeek.forEach((item) => {
    let sleepTime = Object.values(item)[0].rest;
    let day = 0;
    if (+sleepTime.slice(0, 2) > +sleepTime.slice(8, 10)) {
      day =
        24 -
        +sleepTime.slice(0, 2) -
        +sleepTime.slice(3, 5) / 60 +
        +sleepTime.slice(8, 10) +
        +sleepTime.slice(11) / 60;
      sleepHours.push(parseFloat(day.toFixed(2)));
    } else {
      day =
        +sleepTime.slice(8, 10) -
        +sleepTime.slice(0, 2) +
        +sleepTime.slice(11) / 60 -
        +sleepTime.slice(3, 5) / 60;
      sleepHours.push(parseFloat(day.toFixed(2)));
    }
  });
  let days = 0;
  let total = sleepHours.reduce((acc, hour) => {
    if (hour > 0) days++;
    return acc + hour;
  }, 0);
  let avarage = total / days;
  let k = avarage - Math.floor(avarage);
  k = parseFloat(k.toFixed(2));
  let hours = Math.floor(avarage);
  let minutes = Math.floor(k * 60);

  let hoursText = "";
  let minutesText = "";

  if (hours === 1) {
    hoursText = "час";
  }
  if (hours >= 2 && hours <= 4) {
    hoursText = "часа";
  }
  if (hours >= 5) {
    hoursText = "часов";
  }

  if (
    minutes === 1 ||
    minutes === 21 ||
    minutes === 31 ||
    minutes === 41 ||
    minutes === 51
  ) {
    minutesText = "минуту";
  }
  if (
    (minutes >= 2 && minutes <= 4) ||
    (minutes >= 22 && minutes <= 24) ||
    (minutes >= 32 && minutes <= 34) ||
    (minutes >= 42 && minutes <= 44) ||
    (minutes >= 52 && minutes <= 54)
  ) {
    minutesText = "минуты";
  }
  if (
    (minutes >= 5 && minutes <= 20) ||
    (minutes >= 25 && minutes <= 30) ||
    (minutes >= 35 && minutes <= 40) ||
    (minutes >= 45 && minutes <= 50) ||
    (minutes >= 55 && minutes <= 59)
  ) {
    minutesText = "минут";
  }

  let result = `Средняя продолжительность сна за неделю ${hours} ${hoursText} ${
    minutes === 0 ? `` : minutes
  } ${minutesText}`;

  if (days === 1) {
    return `Одного дня недостаточно, чтобы оценить среднюю продолжительность сна`;
  }

  if (days < 1) {
    return `Пока нет данных для оценки средней продолжительности сна`;
  }

  return !isNaN(hours) && !isNaN(minutes)
    ? result
    : `Одно из полей формы "Сон" заполнено неверно, пожалуйста проверьте введённые данные и заполните поле в формате "23:00 - 07:00"`;
}

const showDayRating = (data) => Object.values(data).some(Boolean);

export {
  setPositionButtonInTextarea,
  formatDateInTable,
  averageSleepDuration,
  showDayRating,
};
