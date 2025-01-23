import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./index.css";
import { getWeek } from "../utils";

function MyCalendar() {
  const [value, onChange] = useState(null);
  let navigate = useNavigate();

  const click = (currDate, e) => {
    onChange(getWeek(currDate));
  };

  function navigateToTable() {
    const url = `${value[0].getFullYear()}.${
      value[0].getMonth() + 1
    }.${value[0].getDate()}-${value[1].getFullYear()}.${
      value[1].getMonth() + 1
    }.${value[1].getDate()}`;
    navigate(`${url}`);
  }

  useEffect(() => {
    onChange(getWeek());
  }, []);

  return (
    <div>
      <Calendar onChange={click} value={value} allowPartialRange />
      <button onClick={navigateToTable} type="button">
        To table
      </button>
    </div>
  );
}

export default MyCalendar;
