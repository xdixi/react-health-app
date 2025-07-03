import badMood from "../../../assets/icons/mood/1bad.png";
import sadMood from "../../../assets/icons/mood/2sad.png";
import neutralMood from "../../../assets/icons/mood/3neutral.png";
import happyMood from "../../../assets/icons/mood/4happy.png";
import veryhappyMood from "../../../assets/icons/mood/5veryhappy.png";
import noCommentMood from "../../../assets/icons/mood/0no-comment.png";
import noMood from "../../../assets/icons/mood/no.png";
import type { WeekData } from "../types";

// Тип для возвращаемого значения из formatDateInWeekInfo
const formatDateInWeekInfo = (dataKey: string): [string, string] => {
  const startDate = dataKey
    .slice(0, 9)
    .split(".")
    .reverse()
    .map((num) => num.padStart(2, "0"))
    .join(".");
  const endDate = dataKey
    .slice(10)
    .split(".")
    .reverse()
    .map((num) => num.padStart(2, "0"))
    .join(".");
  return [startDate, endDate];
};

const parseSleepTime = (sleepTime?: string | null): number | null => {
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

const averageSleepDuration = (currWeek: WeekData): string => {
  const sleepDurations = currWeek
    .map((item) => parseSleepTime(Object.values(item)[0].rest))
    .filter(
      (duration): duration is number => duration !== null && duration !== 0
    );

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

const averageMoodRating = (currWeek: WeekData): [string, string] => {
  const rating: number[] = [];
  let moodTxt = "Пока нет данных для средней оценки настроения за неделю";
  let moodImg = noCommentMood;

  const moodValues: Record<number, [string, string]> = {
    1: [`Средняя оценка настроения за неделю \"1\" - \"ужасное\"`, badMood],
    2: [`Средняя оценка настроения за неделю \"2\" - \"плохое\"`, sadMood],
    3: [
      `Средняя оценка настроения за неделю \"3\" - \"нормальное\"`,
      neutralMood,
    ],
    4: [`Средняя оценка настроения за неделю \"4\" - \"хорошее\"`, happyMood],
    5: [
      `Средняя оценка настроения за неделю \"5\" - \"прекрасное\"`,
      veryhappyMood,
    ],
  };

  currWeek.forEach((prop) => {
    const mood = Object.values(prop)[0].dayRating;
    if (mood) {
      rating.push(parseInt(mood));
    }
  });

  if (rating.length === 0) return [moodTxt, moodImg];
  if (rating.length === 1)
    return ["Одного дня мало для средней оценки настроения за неделю", noMood];

  const total = rating.reduce((acc, num) => acc + num, 0);
  const average = Math.round(total / rating.length);

  return moodValues[average];
};

const extractPreasureAndPulse = (preasure: string): string[] => {
  return preasure.match(/\d+\/\d+\/\d+/g) || [];
};

const calculateAverage = (arr: string[]): number => {
  if (arr.length > 0) {
    return Math.ceil(
      arr.reduce((acc, curr) => acc + Number(curr), 0) / arr.length
    );
  }
  return 0;
};

const extractPulse = (str: string): number => {
  const regExp = /\d+\/\d+\/(\d+)/;
  const match = str.match(regExp);
  return match ? Number(match[1]) : 0;
};

const getMaxPulse = (
  preasure: string
): { time: string; maxPulse: number; afterWhat: string } => {
  let maxPulse = 0;
  let time = "";
  let afterWhat = "";

  const arr = preasure.split("\n");
  arr.forEach((line) => {
    const pulse = extractPulse(line);
    if (pulse > maxPulse) {
      maxPulse = pulse;
      time = line.slice(2, 7);
      afterWhat = line.slice(line.lastIndexOf("/") + 1);
    }
  });

  return { time, maxPulse, afterWhat };
};

const averagePreasure = (
  currWeek: WeekData
): [string, Record<string, string>] => {
  const highestPOfWeek: number[] = [];
  const lowestPOfWeek: number[] = [];
  const pulseOfWeek: number[] = [];

  const averageHPperDays: Record<string, string> = {
    Пн: "",
    Вт: "",
    Ср: "",
    Чт: "",
    Пт: "",
    Сб: "",
    Вс: "",
  };

  let preasureText =
    "Пока нет данных для средней оценки давления и пульса за неделю";
  let count = 0;

  currWeek.forEach((dayData, index) => {
    const date = Object.keys(dayData)[0];
    const preasure = dayData[date].pressureAndPulse;
    const dayPreasures = extractPreasureAndPulse(preasure);

    dayPreasures.forEach((entry) => {
      const [high, low, pulse] = entry.split("/").map(Number);
      highestPOfWeek.push(high);
      lowestPOfWeek.push(low);
      pulseOfWeek.push(pulse);
    });

    if (preasure) count++;

    if (dayPreasures.length > 1) {
      const highArr = dayPreasures.map((p) => p.split("/")[0]);
      const lowArr = dayPreasures.map((p) => p.split("/")[1]);
      const pulseArr = dayPreasures.map((p) => p.split("/")[2]);

      averageHPperDays[
        Object.keys(averageHPperDays)[index]
      ] = `${calculateAverage(highArr)}/${calculateAverage(
        lowArr
      )}/${calculateAverage(pulseArr)}`;
    } else {
      averageHPperDays[Object.keys(averageHPperDays)[index]] =
        "одного измерения мало для средней оценки";
    }
  });

  if (count === 0) return [preasureText, averageHPperDays];
  if (count === 1)
    preasureText =
      "Одного дня мало для измерения среднего давления и пульса за неделю";
  else
    preasureText = `Среднее давление и пульс за неделю: ${calculateAverage(
      highestPOfWeek
    )}/${calculateAverage(lowestPOfWeek)}/${calculateAverage(pulseOfWeek)}`;

  return [preasureText, averageHPperDays];
};

const redactMinutesText = (minutes: number): string => {
  if ([1, 21, 31, 41, 51].includes(minutes)) return "минуту";
  if (
    (minutes >= 2 && minutes <= 4) ||
    (minutes >= 22 && minutes <= 24) ||
    (minutes >= 32 && minutes <= 34) ||
    (minutes >= 42 && minutes <= 44) ||
    (minutes >= 52 && minutes <= 54)
  )
    return "минуты";
  return "минут";
};

const redactHoursText = (hours: number): string => {
  if (hours === 1) return "час";
  if (hours >= 2 && hours <= 4) return "часа";
  if (hours >= 5) return "часов";
  return "не определено";
};

export {
  formatDateInWeekInfo,
  parseSleepTime,
  averageSleepDuration,
  averageMoodRating,
  extractPreasureAndPulse,
  calculateAverage,
  getMaxPulse,
  extractPulse,
  averagePreasure,
  redactMinutesText,
  redactHoursText,
};
