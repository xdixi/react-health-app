import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateRestTime } from "../../store/slices/restTimeSlice";

export const useClockTime = (value, start, modalActive, setTimeInModal) => {
  const dispatch = useDispatch();
  const restTime = useSelector((state) => state.restTime.value);

  const initialTime =
    value && start && modalActive
      ? value.slice(0, 5)
      : value && !start
      ? value.slice(8)
      : "00:00";

  const [time, setTime] = useState(initialTime);
  const [am, setAm] = useState(false);
  const [unit, setUnit] = useState(12);

  const setTimeHandler = (angleHour, angleMin) => {
    let timeP = 0;
    let timeH = "";
    let timeM = "";

    if (unit === 12 && !am) {
      if (angleHour) {
        timeP = angleHour / 30 === 0 ? 12 : angleHour / 30;
        timeH = timeP < 10 ? `0${timeP}` : `${timeP}`;
        setTime((prev) => timeH + prev.slice(2));
      }
    }

    if (unit === 12 && am) {
      if (angleHour) {
        timeP = angleHour / 30 + 12;
        timeH = timeP === 24 || timeP === 12 ? "00" : `${timeP}`;
        setTime((prev) => timeH + prev.slice(2));
      }
    }

    if (unit === 60) {
      timeP = angleMin / 6 === 60 ? 0 : angleMin / 6;
      timeM = timeP < 10 ? `0${timeP}` : `${timeP}`;
      setTime((prev) => prev.slice(0, 3) + timeM);
    }
  };

  useEffect(() => {
    dispatch(updateRestTime({ time, start }));
    setTimeInModal((prev) =>
      start ? time + prev.slice(5) : prev.slice(0, 8) + time
    );
  }, [time]);

  return { time, setTime, am, setAm, unit, setUnit, setTimeHandler };
};

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// export const useClockTime = (
//   value,
//   start,
//   modalActive,
//   setRestTime,
//   setTimeInModal
// ) => {
//   const timik = useSelector((state) =>
//     value && start && modalActive
//       ? value.slice(0, 5)
//       : value && !start
//       ? value.slice(8)
//       : state.restTime.value
//   );
//   const dispatch = useDispatch();
//   console.log("timik", timik);
//   const [time, setTime] = useState(
//     value && start && modalActive
//       ? value.slice(0, 5)
//       : value && !start
//       ? value.slice(8)
//       : "00:00"
//   );
//   const [am, setAm] = useState(false);
//   const [unit, setUnit] = useState(12);

//   const setTimeHandler = (angleHour, angleMin) => {
//     let timeP = 0;
//     let timeH = "";
//     let timeM = "";
//     if (unit === 12 && !am) {
//       if (angleHour) {
//         timeP = angleHour / 30 === 0 ? 12 : angleHour / 30;
//         timeH = timeP < 10 ? `0${timeP}` : `${timeP}`;
//         setTime((prev) => timeH + prev.slice(2));
//       }
//     }

//     if (unit === 12 && am) {
//       if (angleHour) {
//         timeP = angleHour / 30 + 12;
//         timeH = timeP === 24 || timeP === 12 ? "00" : `${timeP}`;
//         setTime((prev) => timeH + prev.slice(2));
//       }
//     }

//     if (unit === 60) {
//       timeP = angleMin / 6 === 60 ? 0 : angleMin / 6;
//       timeM = timeP < 10 ? `0${timeP}` : `${timeP}`;
//       setTime((prev) => prev.slice(0, 3) + timeM);
//     }
//   };

//   useEffect(() => {
//     if (start) {
//       setRestTime((prev) => time + prev.slice(5));
//       setTimeInModal((prev) => time + prev.slice(5));
//     } else {
//       setRestTime((prev) => prev.slice(0, 8) + time);
//       setTimeInModal((prev) => prev.slice(0, 8) + time);
//     }
//   }, [time]);

//   return { time, setTime, am, setAm, unit, setUnit, setTimeHandler };
// };
