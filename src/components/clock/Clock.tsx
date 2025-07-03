import React, { useEffect } from "react";
import styles from "./Clock.module.scss";
import { calcAngles } from "./utils";
import { useClockHandler } from "./hooks/useClockHandler";
import { useClockTime } from "./hooks/useClockTime";
import { useClockAngles } from "./hooks/useClockAngles";

interface ClockProps {
  width: number;
  value: string;
  start: boolean;
  setTimeInModal: React.Dispatch<React.SetStateAction<string>>;
  modalActive: boolean;
}

const Clock: React.FC<ClockProps> = ({
  width,
  value,
  start,
  setTimeInModal,
  modalActive,
}) => {
  const { angleHour, setAngleHour, angleMin, setAngleMin } = useClockAngles(
    value,
    start,
    modalActive
  );

  const { time, setTime, am, setAm, unit, setUnit, setTimeHandler } =
    useClockTime({ value, start, modalActive, setTimeInModal });

  const {
    drag,
    clockFaceRef,
    clockFace,
    changeUnitHandler,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseEnter,
    amPmHandler,
    posHandler,
  } = useClockHandler({
    width,
    unit,
    setUnit,
    setAngleHour,
    setAngleMin,
    setTimeHandler,
    angleHour,
    angleMin,
    setAm,
  });

  useEffect(() => {
    setTimeHandler(angleHour, angleMin);
  }, [am]);

  useEffect(() => {
    setUnit(12);
    setAm(false);
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
    setTime(
      value && start && modalActive
        ? value.slice(0, 5)
        : value && !start
        ? value.slice(8)
        : "00:00"
    );
  }, [modalActive]);

  return (
    <div className={styles["clock-wrapper"]}>
      <div
        className={styles["clockface-wrapper"]}
        style={{
          width: `${width}px`,
          height: `${width}px`,
        }}
      >
        <div
          ref={clockFaceRef}
          className={styles.clockface}
          style={{
            width: `${width}px`,
            height: `${width}px`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseEnter={handleMouseEnter}
        >
          {clockFace.map(([x, y]: [number, number], i: number) => {
            if (unit === 12 && !am) {
              return (
                <span
                  key={i}
                  className={styles["clockface-hoursAndMinutes"]}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  {i === 0 ? 12 : i}
                </span>
              );
            } else if (unit === 60) {
              if (i === 0 || i % 5 === 0) {
                return (
                  <span
                    key={i}
                    className={styles["clockface-hoursAndMinutes"]}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  >
                    {i === 0 ? 60 : i}
                  </span>
                );
              }
            } else if (unit === 12 && am) {
              return (
                <span
                  key={i}
                  className={styles["clockface-hoursAndMinutes"]}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  {i === 0 ? "00" : i + 12}
                </span>
              );
            }
          })}
          <div
            className={styles["clockface-time"]}
            style={{
              left: `${posHandler() || 30}px`,
            }}
          >
            {`${time}`}
            <span>{am ? `PM` : `AM`}</span>
          </div>
          <div className={styles["clockface-center"]}></div>
          <div
            className={styles.clockarrow}
            style={{
              width: `${
                unit === 12
                  ? width / 2 - (width * 22) / 100
                  : width / 2 - (width * 14) / 100
              }px`,
              height: "5px",
              transformOrigin: "0% 50%",
              transform: `rotate(${
                unit === 12 ? -90 + angleHour : -90 + angleMin
              }deg)`,
              transition: drag ? "none" : "transform 0.2s ease",
            }}
          ></div>
        </div>
      </div>{" "}
      <div className={styles["clockface-controls"]}>
        <button
          onClick={() => changeUnitHandler()}
          className={
            unit === 12
              ? styles["button-clock-minutes"]
              : styles["button-clock-hours"]
          }
          type="button"
        ></button>
        <button
          className={am ? styles["button-clock-pm"] : styles["button-clock-am"]}
          type="button"
          onClick={() => amPmHandler()}
        ></button>
      </div>
    </div>
  );
};

export default Clock;
