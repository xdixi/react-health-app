import type { WeekData, WeekDay } from "../types";

import badMood from "@assets/icons/mood/1bad.png";
import sadMood from "@assets/icons/mood/2sad.png";
import neutralMood from "@assets/icons/mood/3neutral.png";
import happyMood from "@assets/icons/mood/4happy.png";
import veryhappyMood from "@assets/icons/mood/5veryhappy.png";
import noCommentMood from "@assets/icons/mood/0no-comment.png";

type MoodKey = "dayRating";

type MoodValue =
  | "1bad"
  | "2sad"
  | "3neutral"
  | "4happy"
  | "5veryhappy"
  | "0nocomment";

const handleMoodChange = (
  rowIndex: number,
  date: string,
  moodValue: MoodValue,
  actualWeek: WeekData,
  setActualWeek: (week: WeekData) => void
): void => {
  if (moodValue === undefined) return;

  const key: MoodKey = "dayRating";
  const actualYear = new Date().getFullYear();

  setActualWeek((prevWeek) => {
    const updatedDataWeek = prevWeek.map((day: WeekDay, idx: number) => {
      if (idx === rowIndex) {
        return {
          ...day,
          [date]: {
            ...day[date],
            [key]: moodValue === "0nocomment" ? "" : moodValue,
          },
        };
      }
      return day;
    });
    return updatedDataWeek;
  });

  const updatedDataWeek = [...actualWeek];

  updatedDataWeek[rowIndex][date][key] =
    moodValue === "0nocomment" ? "" : moodValue;

  // const storedJson = localStorage.getItem(`yearData${currentYear}`);
  // if (!storedJson) return [];

  // const storedData: DayData[] = JSON.parse(storedJson); // возможно 'Data${currentYear}'

  // const storedJson = localStorage.getItem(`yearData${actualYear}`); // возможно 'Data${currentYear}'
  // const storedData: DayData[] = JSON.parse(storedJson);

  const storedData = JSON.parse(
    localStorage.getItem(`yearData${actualYear}`) || "[]"
  );

  const updatedYearData = storedData.map((day: WeekDay) => {
    const dayKey = Object.keys(day)[0];
    if (date === dayKey) {
      return updatedDataWeek[rowIndex];
    }
    return day;
  });

  localStorage.setItem(
    `yearData${actualYear}`,
    JSON.stringify(updatedYearData)
  );
};

const switchMoodImg = (mood: MoodValue) => {
  switch (mood) {
    case "1bad":
      return badMood;
    case "2sad":
      return sadMood;
    case "3neutral":
      return neutralMood;
    case "4happy":
      return happyMood;
    case "5veryhappy":
      return veryhappyMood;
    case "0nocomment":
      return noCommentMood;
    default:
      return noCommentMood;
  }
};

const switchMonthEnding = (dataKey: string): string => {
  const timestamp = Date.parse(dataKey);
  if (isNaN(timestamp)) {
    throw new Error(`Invalid date string: ${dataKey}`);
  }
  const dateObj = new Date(timestamp);
  const month = dateObj.toLocaleDateString("ru-RU", { month: "short" });

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

// const renderMoods = (
//     moods,
//     setSelectedOptionHandler,
//     rowIndex,
//     row,
//     dateKey,
//     handleMoodChange,
//     actualWeekKey,
//     moodName
//   ) => {
//     return (
//       <li
//         key={moods.id}
//         onClick={() => setSelectedOptionHandler(moods.moodName)}
//       >
//         <input
//           className={styles[`${moods.moodName.slice(1)}mood`]}
//           type="radio"
//           name={`mood-${rowIndex}`}
//           id={`radio1-${rowIndex}`}
//           value={`${moods.moodName.slice(1)}`}
//           checked={row[dateKey][actualWeekKey] === moodName}
//           onChange={() => handleMoodChange(rowIndex, dateKey, moodName)}
//         />
//       </li>
//     );
//   };

export { handleMoodChange, switchMoodImg, switchMonthEnding };
