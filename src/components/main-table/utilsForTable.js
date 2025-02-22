import badMood from "../../icons/1bad.png";
import sadMood from "../../icons/2sad.png";
import neutralMood from "../../icons/3neutral.png";
import happyMood from "../../icons/4happy.png";
import veryhappyMood from "../../icons/5veryhappy.png";
import noCommentMood from "../../icons/0no-comment.png";
import noMood from "../../icons/no.png";

const setPositionButtonInTextarea = (key, width) => {
  switch (key) {
    case "rest":
      return { left: `${width - 20}px` };
    case "preasure":
      return { left: `${width - 20}px` };
    case "wellBeing":
      return { left: `${width - 20}px` };
    case "pills":
      return { left: `${width - 20}px` };
    default:
      return { left: `${width - 20}px` };
  }
};

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

const parseSleepTime = (sleepTime) => {
  if (!sleepTime || !sleepTime.includes(" - ")) return null;
  const [start, end] = sleepTime
    .split(" - ")
    .map((t) => t.split(":").map(Number));
  if (start.length !== 2 || end.length !== 2) return null;
  const [startHour, startMin] = start;
  const [endHour, endMin] = end;

  let duration = 0;

  if (startHour >= endHour) {
    duration = 24 - startHour - startMin / 60 + endHour + endMin / 60;
  } else {
    duration = endHour - startHour + (endMin - startMin) / 60;
  }

  return parseFloat(duration.toFixed(2));
};

const averageSleepDuration = (currWeek) => {
  const sleepDurations = currWeek
    .map((item) => parseSleepTime(Object.values(item)[0].rest))
    .filter((duration) => duration !== null && duration !== 0);

  if (sleepDurations.length < 1) {
    return "Пока нет данных для оценки средней продолжительности сна";
  }

  if (sleepDurations.length === 1) {
    return "Одного дня недостаточно, чтобы оценить среднюю продолжительность сна";
  }

  const totalSleepHours = sleepDurations.reduce((acc, hours) => acc + hours, 0);
  const average = totalSleepHours / sleepDurations.length;

  const hours = Math.floor(average);
  const minutes = Math.round((average - hours) * 60);

  return `Средняя продолжительность сна за неделю: ${hours} ${redactHoursText(
    hours
  )} ${minutes === 0 ? "" : `${minutes} ${redactMinutesText(minutes)}`}`;
};

const averageMoodRating = (currWeek) => {
  const rating = [];
  let average;
  let total;
  let moodTxt = "Пока нет данных для средней оценки настроения за неделю";
  let moodImg = noCommentMood;
  let moodValues = {
    1: [`Средняя оценка настроения за неделю "1" - "ужасное"`, badMood],
    2: [`Средняя оценка настроения за неделю "2" - "плохое"`, sadMood],
    3: [`Средняя оценка настроения за неделю "3" - "нормальное"`, neutralMood],
    4: [`Средняя оценка настроения за неделю "4" - "хорошее"`, happyMood],
    5: [
      `Средняя оценка настроения за неделю "5" - "прекрасное"`,
      veryhappyMood,
    ],
  };
  currWeek.forEach((prop) => {
    let mood = Object.values(prop)[0].dayRating;
    if (mood) {
      rating.push(parseInt(mood));
    }
  });
  if (!rating.length) {
    return [moodTxt, moodImg];
  }
  if (rating.length === 1) {
    moodTxt = `Одного дня мало для средней оценки настроения за неделю`;
    moodImg = noMood;
    return [moodTxt, moodImg];
  }
  total = rating.reduce((acc, num) => {
    return acc + num;
  }, 0);
  average = Math.round(total / rating.length);
  return moodValues[average];
};

const extractPreasureAndPulse = (preasure) => {
  let preasuresOfDay = preasure.match(/\d+\/\d+\/\d+/g);
  return preasuresOfDay || [];
};

const calculateAverage = (arr) => {
  if (arr.length > 0) {
    return Math.ceil(
      arr.reduce((acc, curr) => acc + Number(curr), 0) / arr.length
    );
  }
  return 0;
};

const getMaxPulse = (preasure) => {
  let maxPulse = 0;
  let time = "";
  let afterWhat = "";

  const arr = preasure.split("\n");
  arr.forEach((line) => {
    let pulse = extractPulse(line);
    if (pulse > maxPulse) {
      maxPulse = pulse;
      time = line.slice(2, 7);
      afterWhat = line.slice(line.lastIndexOf("/") + 1);
    }
  });

  return { time, maxPulse, afterWhat };
};

const extractPulse = (str) => {
  const regExp = /\d+\/\d+\/(\d+)/;
  const match = str.match(regExp);
  return match ? Number(match[1]) : 0;
};

const averagePreasure = (currWeek) => {
  const highestPOfWeek = [];
  const lowestPOfWeek = [];
  const pulseOfWeek = [];
  const averageHPperDays = {
    Пн: "",
    Вт: "",
    Ср: "",
    Чт: "",
    Пт: "",
    Сб: "",
    Вс: "",
  };
  let averageHPofWeek = 0;
  let averageLPofWeek = 0;
  let averagePulse = 0;
  let preasureText =
    "Пока нет данных для средней оценки давления и пульса за неделю";

  let maxPulse = 0;
  let time = "";
  let afterWhat = "";
  let dateOfMaxPulse = "";

  let count = 0;

  currWeek.forEach((dayData) => {
    let date = Object.keys(dayData)[0];
    let preasure = dayData[date].preasure;
    let dayPreasures = extractPreasureAndPulse(preasure);
    dayPreasures.forEach((preasureData) => {
      let [high, low, pulse] = preasureData.split("/").map(Number);
      highestPOfWeek.push(high);
      lowestPOfWeek.push(low);
      pulseOfWeek.push(pulse);
    });

    if (preasure) {
      count++;
      const {
        time: maxTime,
        maxPulse: currMaxPulse,
        afterWhat: currAfterWhat,
      } = getMaxPulse(preasure);
      if (currMaxPulse > maxPulse) {
        maxPulse = currMaxPulse;
        time = maxTime;
        afterWhat = currAfterWhat;
        dateOfMaxPulse = date;
      }
    }
  });

  averageHPofWeek = calculateAverage(highestPOfWeek);
  averageLPofWeek = calculateAverage(lowestPOfWeek);
  averagePulse = calculateAverage(pulseOfWeek);

  if (count === 0) {
    return [preasureText, averageHPperDays];
  } else if (count === 1) {
    preasureText =
      "Одного дня мало для измерения среднего давления и пульса за неделю";
  } else {
    preasureText = `Среднее давление и пульс за неделю: ${averageHPofWeek}/${averageLPofWeek}/${averagePulse}`;
  }
  currWeek.forEach((dayData, index) => {
    let date = Object.keys(dayData)[0];
    let preasure = dayData[date].preasure;
    let dayPreasures = extractPreasureAndPulse(preasure);

    if (dayPreasures.length > 1) {
      let higherArr = dayPreasures.map((p) => p.split("/")[0]);
      let lowerArr = dayPreasures.map((p) => p.split("/")[1]);
      let pulseArr = dayPreasures.map((p) => p.split("/")[2]);

      let higherAverage = calculateAverage(higherArr);
      let lowerAverage = calculateAverage(lowerArr);
      let pulseAverage = calculateAverage(pulseArr);

      switch (index) {
        case 0:
          averageHPperDays[
            "Пн"
          ] = `${higherAverage}/${lowerAverage}/${pulseAverage}`;
          break;
        case 1:
          averageHPperDays[
            "Вт"
          ] = `${higherAverage}/${lowerAverage}/${pulseAverage}`;
          break;
        case 2:
          averageHPperDays[
            "Ср"
          ] = `${higherAverage}/${lowerAverage}/${pulseAverage}`;
          break;
        case 3:
          averageHPperDays[
            "Чт"
          ] = `${higherAverage}/${lowerAverage}/${pulseAverage}`;
          break;
        case 4:
          averageHPperDays[
            "Пт"
          ] = `${higherAverage}/${lowerAverage}/${pulseAverage}`;
          break;
        case 5:
          averageHPperDays[
            "Сб"
          ] = `${higherAverage}/${lowerAverage}/${pulseAverage}`;
          break;
        case 6:
          averageHPperDays[
            "Вс"
          ] = `${higherAverage}/${lowerAverage}/${pulseAverage}`;
          break;
        default:
          break;
      }
    } else {
      let txt = "одного измерения мало для средней оценки";
      switch (index) {
        case 1:
          averageHPperDays["Вт"] = txt;
          break;
        case 2:
          averageHPperDays["Ср"] = txt;
          break;
        case 3:
          averageHPperDays["Чт"] = txt;
          break;
        case 4:
          averageHPperDays["Пт"] = txt;
          break;
        case 5:
          averageHPperDays["Сб"] = txt;
          break;
        case 6:
          averageHPperDays["Вс"] = txt;
          break;
        default:
          break;
      }
    }
  });

  return [preasureText, averageHPperDays];
};

const redactMinutesText = (minutes) => {
  switch (true) {
    case [1, 21, 31, 41, 51].includes(minutes):
      return "минуту";
    case (minutes >= 2 && minutes <= 4) ||
      (minutes >= 22 && minutes <= 24) ||
      (minutes >= 32 && minutes <= 34) ||
      (minutes >= 42 && minutes <= 44) ||
      (minutes >= 52 && minutes <= 54):
      return "минуты";
    default:
      return "минут";
  }
};

const redactHoursText = (hours) => {
  switch (true) {
    case hours === 1:
      return "час";
    case hours >= 2 && hours <= 4:
      return "часа";
    case hours >= 5:
      return "часов";
    default:
      return "не определено";
  }
};

export {
  setPositionButtonInTextarea,
  formatDateInTable,
  averageSleepDuration,
  averageMoodRating,
  averagePreasure,
};
