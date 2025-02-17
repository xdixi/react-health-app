import React, { useEffect, useRef, useState } from "react";

const distributeClockNumbers = (containerSize, units) => {
  const radius = containerSize / 2 - 15;
  const positions = [];
  const step = 360 / units;

  for (let i = 0; i < units; i++) {
    const angle = i * step * (Math.PI / 180);
    const x = Math.round(radius * Math.sin(angle));
    const y = -Math.round(radius * Math.cos(angle));
    positions.push([x, y]);
  }

  return positions;
};

const calcAngles = (value) => {
  let startAngleH = 0,
    startAngleM = 0,
    endAngleH = 0,
    endAngleM = 0;
  let startH = 0,
    startM = 0,
    endH = 0,
    endM = 0;
  startH = value.slice(0, 2).startsWith("0")
    ? value.slice(1, 2)
    : value.slice(0, 2);
  startM = value.slice(3, 5).startsWith("0")
    ? value.slice(4, 5)
    : value.slice(3, 5);
  endH = value.slice(8, 10).startsWith("0")
    ? value.slice(9, 10)
    : value.slice(8, 10);
  endM = value.slice(11).startsWith("0") ? value.slice(12) : value.slice(11);
  startAngleH = startH * 30;
  startAngleM = startM * 6;
  endAngleH = endH * 30;
  endAngleM = endM * 6;
  return [startAngleH, startAngleM, endAngleH, endAngleM];
};

const Clock = ({
  width,
  restTime,
  setRestTime,
  start,
  activeCell,
  onChange,
}) => {
  const [time, setTime] = useState("00:00");
  const [am, setAm] = useState(false);
  const [angleHour, setAngleHour] = useState(0);
  const [angleMin, setAngleMin] = useState(0);
  const [angle, setAngle] = useState(0);
  const [changeUnit, setChangeUnit] = useState(false);
  const [drag, setDrag] = useState(false);
  const [unit, setUnit] = useState(12);
  const clockArrow = useRef(null);
  const clockFace = distributeClockNumbers(width, unit);

  const calcCenterOfClock = () => {
    const clockElem = clockArrow.current;
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
    setAngle(angleDegrees);
    return calcDegrees(angleDegrees, step);
  };

  const calcDegrees = (deg, step) => {
    let k = Math.round(deg / step);
    return k * step;
  };

  const changeUnitHandler = () => {
    setUnit((prev) => (prev === 12 ? 60 : 12));
    setChangeUnit(false);
  };

  const handleMouseDown = (event) => {
    setDrag(true);
    setChangeUnit(true);
    if (unit === 12) {
      setAngleHour(calculateClickAngle(event));
    } else if (unit === 60) {
      setAngleMin(calculateClickAngle(event));
    }
  };

  const handleMouseMove = (event) => {
    if (!drag) return;
    if (event.buttons !== 1) {
      setDrag(false);
      return;
    }
    if (unit === 12) {
      setAngleHour(calculateClickAngle(event));
    } else if (unit === 60) {
      setAngleMin(calculateClickAngle(event));
    }
    setTimeHandler();
  };

  const handleMouseUp = (event) => {
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

    setAm((prevAm) => {
      const newAm = !prevAm;

      setTime((prevTime) => {
        let updatedTime = prevTime;
        if (unit === 12 && newAm) {
          let timeP = angleHour / 30 === 0 ? 12 : angleHour / 30;
          updatedTime = `${timeP < 10 ? `0${timeP}` : timeP}${prevTime.slice(
            2
          )}`;
        } else if (unit === 12 && !newAm) {
          let timeP = angleHour / 30 + 12;
          updatedTime = `${
            timeP === 24 || timeP === 12 ? "00" : timeP
          }${prevTime.slice(2)}`;
        }
        return updatedTime;
      });

      setRestTime((prevRestTime) => {
        const newRestTime = start
          ? time + prevRestTime.slice(5)
          : prevRestTime.slice(0, 8) + time;

        onChange(newRestTime, activeCell.row, "rest");
        return newRestTime;
      });

      return newAm;
    });

    setChangeUnit((prev) => !prev);
  };

  const setPositionDivTime = () => {
    if (angle === 0) {
      return 30;
    }
    if (angle >= 1 && angle <= 179) {
      return 30;
    }
    if (angle <= 360 && angle >= 181) {
      return 106;
    }
  };

  const setTimeHandler = () => {
    let timeP = 0;
    let timeH = "";
    let timeM = "";
    if (unit === 12 && am === false) {
      if (angleHour) {
        timeP = angleHour / 30 === 0 ? 12 : angleHour / 30;
        if (timeP < 10) {
          timeH = `0${timeP}`;
        } else {
          timeH = `${timeP}`;
        }
        setTime((prev) => timeH + prev.slice(2));
      }
    }
    if (unit === 12 && am === true) {
      if (angleHour) {
        timeP = angleHour / 30 + 12;

        if (timeP === 24 || timeP === 12) {
          timeH = "00";
        } else {
          timeH = `${timeP}`;
        }
        setTime((prev) => timeH + prev.slice(2));
      }
    }
    if (unit === 60) {
      timeP = angleMin / 6 === 60 ? 0 : angleMin / 6;
      if (timeP < 10) {
        timeM = `0${timeP}`;
      } else {
        timeM = `${timeP}`;
      }
      setTime((prev) => prev.slice(0, 3) + timeM);
    }
    if (start) {
      setRestTime((prev) => {
        return time + prev.slice(5);
      });
    } else {
      setRestTime((prev) => prev.slice(0, 8) + time);
    }
    onChange(restTime, activeCell.row, "rest");
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
    setPositionDivTime();
  }, [angle, angleHour, am]);

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: `${width}px`,
          height: `${width}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "20px",
        }}
      >
        <div
          ref={clockArrow}
          style={{
            width: `${width}px`,
            height: `${width}px`,
            position: "relative",
            border: "solid 1px black",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            userSelect: "none",
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
                  style={{
                    position: "absolute",
                    transform: `translate(${x}px, ${y}px)`,
                    fontSize: "18px",
                    fontWeight: "bold",
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
                    style={{
                      position: "absolute",
                      transform: `translate(${x}px, ${y}px)`,
                      fontSize: "18px",
                      fontWeight: "bold",
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
                  style={{
                    position: "absolute",
                    transform: `translate(${x}px, ${y}px)`,
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {i === 0 ? "00" : i + 12}
                </span>
              );
            }
          })}
          <div
            style={{
              fontSize: "12px",
              position: "absolute",
              border: "1px solid black",
              width: "60px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              left: `${posHandler() || 30}px`,
            }}
          >
            {`${time}`}
            <span>{am ? `AM` : `PM`}</span>
          </div>
          <div
            className="clockarrow"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              backgroundColor: "black",
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
      <div
        style={{ display: "flex", flexDirection: "column", marginLeft: "10px" }}
      >
        <button
          onClick={() => changeUnitHandler()}
          style={{ width: "32px", height: "32px" }}
          type="button"
        >
          {unit === 12 ? `M` : `H`}
        </button>
        <button
          style={{ width: "40px", height: "32px", marginTop: "20px" }}
          type="button"
          onClick={() => amPmHandler()}
        >
          {am ? `PM` : `AM`}
        </button>
      </div>
    </div>
  );
};

export default Clock;
