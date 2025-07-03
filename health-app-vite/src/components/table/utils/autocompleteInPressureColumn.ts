import type { DayEntry } from "../types";

const addNumberingInPressureColumn = (
  currWeek: DayEntry[],
  row: number,
  setNumbering: (value: number) => void
): number => {
  let nextNum = 0;
  currWeek.forEach((prop, i) => {
    if (row === i) {
      const dayData = Object.values(prop)[0];
      const preasureTxt = dayData.pressureAndPulse;

      Array.from(preasureTxt).forEach((_, i, str) => {
        if (str[i] === ")" && +str[i - 1] >= 0 && +str[i - 1] <= 9) {
          nextNum = +str[i - 1] + 1;
        }
      });
    }
  });

  setNumbering(nextNum);
  return nextNum;
};

const getNextLineNumber = (value: string): number => {
  const matches = value.match(/^(\d+)\)/gm);
  if (!matches || matches.length === 0) return 1;
  const last = matches[matches.length - 1];
  const num = parseInt(last);
  return isNaN(num) ? 1 : num + 1;
};

export { addNumberingInPressureColumn, getNextLineNumber };

// const addNumberingInPreasureColumn = (currWeek, row) => {
//   let nextNum = 0;
//   currWeek.forEach((prop, i) => {
//     if (row === i) {
//       let preasureTxt = Object.values(prop)[0].preasure;
//       Array.from(preasureTxt).forEach((_, i, str) => {
//         if (str[i] === ")" && +str[i - 1] >= 0 && +str[i - 1] <= 9) {
//           nextNum = +str[i - 1] + 1;
//         }
//       });
//     }
//   });
//   setNumberlingHandler(nextNum);
//   return nextNum;
// };
