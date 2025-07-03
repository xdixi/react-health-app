import { useState, useEffect } from "react";
import { calcAngles } from "../utils";

export const useClockAngles = (
  value: string,
  start: boolean,
  modalActive: boolean
) => {
  const [angleHour, setAngleHour] = useState<number>(
    value && start && modalActive
      ? calcAngles(value)[0]
      : value && !start
      ? calcAngles(value)[2]
      : 0
  );

  const [angleMin, setAngleMin] = useState<number>(
    value && start && modalActive
      ? calcAngles(value)[1]
      : value && !start
      ? calcAngles(value)[3]
      : 0
  );

  useEffect(() => {
    setAngleHour(
      value && start && modalActive
        ? calcAngles(value)[0]
        : value && !start
        ? calcAngles(value)[2]
        : 0
    );

    setAngleMin(
      value && start && modalActive
        ? calcAngles(value)[1]
        : value && !start
        ? calcAngles(value)[3]
        : 0
    );
  }, [modalActive, value, start]);

  return {
    angleHour,
    setAngleHour,
    angleMin,
    setAngleMin,
  };
};
