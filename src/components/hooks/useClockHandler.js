import { useState, useRef, useEffect } from "react";
import { calcDegrees, distributeClockNumbers } from "../clock/utils";

export const useClockHandler = (
  width,
  unit,
  setUnit,
  setAngleHour,
  setAngleMin,
  setTimeHandler,
  angleHour,
  angleMin,
  setAm
) => {
  const [changeUnit, setChangeUnit] = useState(false);
  const [drag, setDrag] = useState(false);

  const clockFaceRef = useRef(null);
  const clockFace = distributeClockNumbers(width, unit);

  const calcCenterOfClock = () => {
    const clockElem = clockFaceRef.current;
    if (!clockElem) return [0, 0];

    const rect = clockElem.getBoundingClientRect();
    return [rect.left + rect.width / 2, rect.top + rect.height / 2];
  };

  const calculateClickAngle = (event) => {
    const [centerX, centerY] = calcCenterOfClock();
    const clickX = event.clientX;
    const clickY = event.clientY;
    const xDiff = clickX - centerX;
    const yDiff = centerY - clickY;
    const step = 360 / unit;

    let angleDegrees;

    if (xDiff === 0) {
      if (yDiff > 0) {
        angleDegrees = 0;
      } else if (yDiff < 0) {
        angleDegrees = 180;
      } else {
        angleDegrees = 0;
      }
    } else {
      angleDegrees = Math.atan2(yDiff, xDiff) * (180 / Math.PI);
      angleDegrees = (360 - angleDegrees + 90) % 360;
    }
    return calcDegrees(angleDegrees, step);
  };

  const changeUnitHandler = () => {
    setUnit((prev) => (prev === 12 ? 60 : 12));
    setChangeUnit(false);
  };

  const handleMouseDown = (event) => {
    clockFaceRef.current.style.cursor = "move";
    setDrag(true);
    setChangeUnit(true);
    if (unit === 12) {
      setAngleHour(calculateClickAngle(event));
    } else if (unit === 60) {
      setAngleMin(calculateClickAngle(event));
    }
    setTimeHandler(angleHour, angleMin);
  };

  const handleMouseMove = (event) => {
    if (!drag) return;
    if (event.buttons !== 1) {
      setDrag(false);
      return;
    }
    if (unit === 12) {
      clockFaceRef.current.style.cursor = "move";
      setAngleHour(calculateClickAngle(event));
    } else if (unit === 60) {
      setAngleMin(calculateClickAngle(event));
    }
    setTimeHandler(angleHour, angleMin);
  };

  const handleMouseUp = (event) => {
    clockFaceRef.current.style.cursor = "";

    if (changeUnit && event.buttons === 0) {
      setUnit((prev) => (prev === 12 ? 60 : 60));
    }
    if (event.buttons === 1) {
      setDrag(false);
      return;
    }
  };

  const handleMouseEnter = (event) => {
    if (event.buttons === 1) {
      setDrag(true);
      setChangeUnit(true);
    }
    if (changeUnit && event.buttons === 1) {
      setChangeUnit(true);
    }
  };

  const amPmHandler = () => {
    setUnit(12);
    setAm((prev) => !prev);
  };

  const posHandler = () => {
    if (unit === 12 && angleHour === 90) {
      return 30;
    }
    if (unit === 12 && angleHour <= 360 && angleHour >= 180) {
      return 106;
    }
    if (unit === 12 && angleHour >= 0 && angleHour <= 180) {
      return 30;
    }
    if (unit === 60 && angleMin <= 360 && angleMin >= 180) {
      return 106;
    }
    if (unit === 60 && angleMin >= 0 && angleMin <= 180) {
      return 30;
    }
  };

  useEffect(() => {
    setTimeHandler(angleHour, angleMin);
  }, [angleHour, angleMin]);

  return {
    changeUnit,
    setChangeUnit,
    drag,
    setDrag,
    clockFaceRef,
    clockFace,
    changeUnitHandler,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseEnter,
    amPmHandler,
    posHandler,
  };
};
