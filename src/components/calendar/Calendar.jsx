import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import classes from "./Calendar.module.css";
import { generateYearData, getWeek } from "./utilsCalendar";
import useWindowSize from "../hooks/useWindowSize";

import buttonForward from "../../icons/button-forward.png";

const prevURL = [];

const MyCalendar = () => {
  const [value, onChange] = useState(prevURL[prevURL.length - 1] || getWeek());
  const [prevURLHandler, setPrevURLHandler] = useState([]); // чтобы не заполнять prevURL
  const [buttonPositionTop, setButtonPositionTop] = useState("0px");
  const [buttonPositionLeft, setButtonPositionLeft] = useState("50%");
  const { width } = useWindowSize();
  let navigate = useNavigate();

  const chooseWeek = (currDate, e) => {
    onChange(getWeek(currDate));
    prevURL.push(getWeek(currDate));
    setPrevURLHandler(getWeek());
  };

  const navigateToTable = () => {
    const url = `${value[0].getFullYear()}.${
      value[0].getMonth() + 1
    }.${value[0].getDate()}-${value[1].getFullYear()}.${
      value[1].getMonth() + 1
    }.${value[1].getDate()}`;
    navigate(`${url}`);
  };

  useEffect(() => {
    if (prevURL.length > 1) {
      prevURL.splice(0, prevURL.length - 1);
    }
  }, [prevURLHandler]);

  useEffect(() => {
    setTimeout(() => {
      // время на обновление DOM
      const activeDay = document.querySelector(".react-calendar__tile--active");
      if (activeDay) {
        const { top } = activeDay.getBoundingClientRect();
        setButtonPositionTop(`${top - 100}px`);
      }
    });
  }, [value]);

  useEffect(() => {
    const storedData = localStorage.getItem("yearData2025");

    if (!storedData) {
      const yearData = generateYearData("2025");
      localStorage.setItem("yearData2025", JSON.stringify(yearData));
    }
  }, []);

  useEffect(() => {
    setButtonPositionLeft(`${width / 2 + 175}px`);
  }, [width]);

  return (
    <div className={classes["calendar-wrapper"]}>
      <Calendar onChange={chooseWeek} value={value} allowPartialRange />
      <div
        style={{
          position: "absolute",
          top: `${buttonPositionTop}`,
          left: `${buttonPositionLeft}`,
        }}
      >
        {" "}
        <div
          className={classes["button-forward-wrapper"]}
          onClick={navigateToTable}
        >
          <img
            src={buttonForward}
            alt="button-forward"
            width={38}
            height={38}
          />
          <button
            className={classes["button-calendar__forward"]}
            type="button"
          ></button>
        </div>
      </div>
    </div>
  );
};

export default MyCalendar;
