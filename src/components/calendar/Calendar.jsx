import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./index.css";
import { getWeek } from "../utils";

const generateYearData = (startYear) => {
  let actualDate = new Date(startYear);
  let actualYear = [];

  for (let i = 0; i < 365; i++) {
    let day = actualDate.getDate();
    let month = actualDate.getMonth();
    let year = actualDate.getFullYear();
    let dateString = `${year}.${month + 1}.${day}`;

    const dayData = {
      [dateString]: {
        rest: "",
        preasure: "",
        wellBeing: "",
        pills: "",
        dayRating: "",
      },
    };

    actualYear.push(dayData);
    actualDate.setDate(actualDate.getDate() + 1);
  }

  return actualYear;
};

const prevURL = [];

function MyCalendar() {
  const [value, onChange] = useState(prevURL[prevURL.length - 1] || getWeek());
  const [prevURLHandler, setPrevURLHandler] = useState([]); // чтобы не заполнять prevURL
  const [buttonPositionTop, setButtonPositionTop] = useState("0px");
  const [buttonPositionLeft, setButtonPositionLeft] = useState("0px");

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
        const { top, left } = activeDay.getBoundingClientRect();
        setButtonPositionTop(`${top - 95}px`);
        setButtonPositionLeft(`${left + 360}px`);
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

  return (
    <div
      style={{
        position: "relative",
        display: "grid",
        justifyItems: "center",
        marginTop: "100px",
      }}
    >
      <Calendar onChange={chooseWeek} value={value} allowPartialRange />
      <div
        style={{
          position: "absolute",
          top: `${buttonPositionTop}`,
          left: `${buttonPositionLeft}`,
        }}
      >
        {" "}
        <button onClick={navigateToTable} type="button">
          Перейти к неделе
        </button>
      </div>
    </div>
  );
}

export default MyCalendar;
