import { useState, useEffect } from "react";
import { calcAngles } from "../clock/utilsClock";

export const useClockAngles = (value, start, modalActive) => {
  const [angleHour, setAngleHour] = useState(
    value && start && modalActive
      ? calcAngles(value)[0]
      : value && !start
      ? calcAngles(value)[2]
      : 0
  );

  const [angleMin, setAngleMin] = useState(
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

  return { angleHour, setAngleHour, angleMin, setAngleMin };
};
