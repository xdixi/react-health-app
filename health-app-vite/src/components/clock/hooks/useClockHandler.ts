import {
  useState,
  useRef,
  useEffect,
  RefObject,
  MouseEvent as ReactMouseEvent,
} from "react";
import { calcDegrees, distributeClockNumbers } from "../utils";

interface UseClockHandlerParams {
  width: number;
  unit: number; // 12 или 60
  setUnit: React.Dispatch<React.SetStateAction<number>>;
  setAngleHour: React.Dispatch<React.SetStateAction<number>>;
  setAngleMin: React.Dispatch<React.SetStateAction<number>>;
  setTimeHandler: (hourAngle: number, minAngle: number) => void;
  angleHour: number;
  angleMin: number;
  setAm: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UseClockHandlerResult {
  changeUnit: boolean;
  setChangeUnit: React.Dispatch<React.SetStateAction<boolean>>;
  drag: boolean;
  setDrag: React.Dispatch<React.SetStateAction<boolean>>;
  clockFaceRef: RefObject<HTMLDivElement>;
  clockFace: [number, number][];
  changeUnitHandler: () => void;
  handleMouseDown: (event: ReactMouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (event: ReactMouseEvent<HTMLDivElement>) => void;
  handleMouseUp: (event: ReactMouseEvent<HTMLDivElement>) => void;
  handleMouseEnter: (event: ReactMouseEvent<HTMLDivElement>) => void;
  amPmHandler: () => void;
  posHandler: () => number | undefined;
}

export const useClockHandler = ({
  width,
  unit,
  setUnit,
  setAngleHour,
  setAngleMin,
  setTimeHandler,
  angleHour,
  angleMin,
  setAm,
}: UseClockHandlerParams): UseClockHandlerResult => {
  const [changeUnit, setChangeUnit] = useState<boolean>(false);
  const [drag, setDrag] = useState<boolean>(false);

  const clockFaceRef = useRef<HTMLDivElement>(null);
  const clockFace = distributeClockNumbers(width, unit);

  const calcCenterOfClock = (): [number, number] => {
    const clockElem = clockFaceRef.current;
    if (!clockElem) return [0, 0];

    const rect = clockElem.getBoundingClientRect();
    return [rect.left + rect.width / 2, rect.top + rect.height / 2];
  };

  const calculateClickAngle = (
    event: ReactMouseEvent<HTMLDivElement>
  ): number => {
    const [centerX, centerY] = calcCenterOfClock();
    const clickX = event.clientX;
    const clickY = event.clientY;
    const xDiff = clickX - centerX;
    const yDiff = centerY - clickY;
    const step = 360 / unit;

    let angleDegrees: number;

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

  const changeUnitHandler = (): void => {
    setUnit((prev) => (prev === 12 ? 60 : 12));
    setChangeUnit(false);
  };

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>): void => {
    if (!clockFaceRef.current) return;
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

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>): void => {
    if (!drag) return;
    if (event.buttons !== 1) {
      setDrag(false);
      return;
    }
    if (!clockFaceRef.current) return;
    if (unit === 12) {
      clockFaceRef.current.style.cursor = "move";
      setAngleHour(calculateClickAngle(event));
    } else if (unit === 60) {
      setAngleMin(calculateClickAngle(event));
    }
    setTimeHandler(angleHour, angleMin);
  };

  const handleMouseUp = (event: ReactMouseEvent<HTMLDivElement>): void => {
    if (clockFaceRef.current) clockFaceRef.current.style.cursor = "";

    if (changeUnit && event.buttons === 0) {
      setUnit((prev) => (prev === 12 ? 60 : 60)); // тут возможно опечатка? Почему всегда 60?
    }
    if (event.buttons === 1) {
      setDrag(false);
      return;
    }
  };

  const handleMouseEnter = (event: ReactMouseEvent<HTMLDivElement>): void => {
    if (event.buttons === 1) {
      setDrag(true);
      setChangeUnit(true);
    }
    if (changeUnit && event.buttons === 1) {
      setChangeUnit(true);
    }
  };

  const amPmHandler = (): void => {
    setUnit(12);
    setAm((prev) => !prev);
  };

  const posHandler = (): number | undefined => {
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
    return undefined;
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
