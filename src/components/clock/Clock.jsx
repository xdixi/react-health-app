import React, { useEffect } from "react";
import classes from "./Clock.module.css";
import { useClockTime } from "../hooks/useClockTime";
import { useClockAngles } from "../hooks/useClockAngles";
import { calcAngles } from "./utilsClock";
import { useClockHandler } from "../hooks/useClockHandler";

const Clock = ({
  width,
  value,
  setRestTime,
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
    useClockTime(value, start, modalActive, setRestTime, setTimeInModal);

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
  } = useClockHandler(
    width,
    unit,
    setUnit,
    setAngleHour,
    setAngleMin,
    setTimeHandler,
    angleHour,
    angleMin,
    setAm
  );

  useEffect(() => {
    setTimeHandler(angleHour, angleMin);
  }, [am]);

  useEffect(() => {
    setUnit(12);
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
    <div className={classes["clock-wrapper"]}>
      <div
        className={classes["clockface-wrapper"]}
        style={{
          width: `${width}px`,
          height: `${width}px`,
        }}
      >
        <div
          ref={clockFaceRef}
          className={classes.clockface}
          style={{
            width: `${width}px`,
            height: `${width}px`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseEnter={handleMouseEnter}
        >
          {clockFace.map(([x, y], i) => {
            if (unit === 12 && !am) {
              return (
                <span
                  key={i}
                  className={classes["clockface-hoursAndMinutes"]}
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
                    className={classes["clockface-hoursAndMinutes"]}
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
                  className={classes["clockface-hoursAndMinutes"]}
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
            className={classes["clockface-time"]}
            style={{
              left: `${posHandler() || 30}px`,
            }}
          >
            {`${time}`}
            <span>{am ? `PM` : `AM`}</span>
          </div>
          <div className={classes["clockface-center"]}></div>
          <div
            className={classes.clockarrow}
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
      <div className={classes["clockface-controls"]}>
        <button
          onClick={() => changeUnitHandler()}
          className={
            unit === 12
              ? classes["button-clock-minutes"]
              : classes["button-clock-hours"]
          }
          type="button"
        ></button>
        <button
          className={
            am ? classes["button-clock-pm"] : classes["button-clock-am"]
          }
          type="button"
          onClick={() => amPmHandler()}
        ></button>
      </div>
    </div>
  );
};

export default Clock;
