import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "react-calendar/dist/Calendar.css";
import styles from "./Calendar.module.scss";
import useWindowSize from "./hooks/useWindowSize";
import { loadSelectedWeek, saveSelectedWeek } from "./utils/storage";
import { formatWeekRangeToUrl, generateYearData, getWeek } from "./utils/date";
import { Calendar, type CalendarProps } from "react-calendar";

import calendarWeek_pic from "@assets/icons/calendar/calendar-week.png";
import buttonForward_pic from "../../assets/icons/buttons/forward.png";
import Button from "../../components/UI/button";

const MyCalendar: React.FC = () => {
  const [prevWeek, setPrevWeek] = useState<[Date, Date]>(() => {
    return loadSelectedWeek() || getWeek();
  });

  const [buttonPositionTop, setButtonPositionTop] = useState("0px");
  const [buttonPositionLeft, setButtonPositionLeft] = useState("50%");
  const { width } = useWindowSize();
  const navigate = useNavigate();

  const chooseWeek: CalendarProps["onChange"] = (currDate) => {
    if (!currDate) return;

    const date = Array.isArray(currDate) ? currDate[0] : currDate;
    if (!date) return;

    const week = getWeek(date);
    setPrevWeek(week);
    saveSelectedWeek(week);
  };

  const navigateToTable = () => {
    navigate(formatWeekRangeToUrl(prevWeek));
  };

  const navigateToHome = () => {
    navigate("/");
  };

  useEffect(() => {
    setTimeout(() => {
      const activeDay = document.querySelector(
        ".react-calendar__tile--active"
      ) as HTMLElement;

      if (activeDay) {
        const { top } = activeDay.getBoundingClientRect();
        setButtonPositionTop(`${top}px`);
      }
    });
  }, [prevWeek]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const storedData = localStorage.getItem(`yearData${currentYear}`);

    if (!storedData) {
      const yearData = generateYearData(currentYear);
      localStorage.setItem(`yearData${currentYear}`, JSON.stringify(yearData));
    }
  }, []);

  useEffect(() => {
    const calendarElement = document.querySelector(
      ".react-calendar"
    ) as HTMLElement;

    if (calendarElement) {
      setButtonPositionLeft(`${width / 2 + calendarElement.offsetWidth / 2}px`);
    }
  }, [width]);

  return (
    <div className={styles["calendar"]}>
      <div className={styles["calendar__buttons"]}>
        <Button onClick={navigateToHome}>На главную</Button>
        <Button onClick={navigateToTable}>К неделе</Button>
      </div>
      <Calendar onChange={chooseWeek} value={prevWeek} allowPartialRange />
      <div
        className={styles["calendar__pics-before-button"]}
        style={{
          top: buttonPositionTop,
          left: buttonPositionLeft,
        }}
      >
        <img
          className={styles["calendar__pic"]}
          src={buttonForward_pic}
          alt="button-forward"
        />
        <img
          className={styles["calendar__pic"]}
          src={calendarWeek_pic}
          alt="calendar"
        />
      </div>
    </div>
  );
};

export default MyCalendar;
