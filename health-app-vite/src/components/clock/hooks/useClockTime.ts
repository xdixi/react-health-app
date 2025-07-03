import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import { setRestTime } from "../../../store/slices/restTimeSlice";

interface UseClockTimeParams {
  value: string;
  start: boolean;
  modalActive: boolean;
  setTimeInModal: React.Dispatch<React.SetStateAction<string>>;
}

interface UseClockTimeResult {
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  am: boolean;
  setAm: React.Dispatch<React.SetStateAction<boolean>>;
  unit: number;
  setUnit: React.Dispatch<React.SetStateAction<number>>;
  setTimeHandler: (angleHour: number, angleMin: number) => void;
}

export const useClockTime = ({
  value,
  start,
  modalActive,
  setTimeInModal,
}: UseClockTimeParams): UseClockTimeResult => {
  const dispatch = useDispatch<AppDispatch>();
  const restTime = useSelector((state: RootState) => state.restTime.value);

  const initialTime =
    value && start && modalActive
      ? value.slice(0, 5)
      : value && !start
      ? value.slice(8)
      : "00:00";

  const [time, setTime] = useState<string>(initialTime);
  const [am, setAm] = useState<boolean>(false);
  const [unit, setUnit] = useState<number>(12);

  const setTimeHandler = (angleHour: number, angleMin: number) => {
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
    dispatch(setRestTime({ time, start }));
    setTimeInModal((prev) =>
      start ? time + prev.slice(5) : prev.slice(0, 8) + time
    );
  }, [time, dispatch, start, setTimeInModal]);

  return { time, setTime, am, setAm, unit, setUnit, setTimeHandler };
};
