import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./Calendar.module.scss";
import buttonForward from "../../assets/icons/buttons/forward.png";
import { saveSelectedWeek, loadSelectedWeek } from "./utils/storage";
import { formatWeekRangeToUrl, generateYearData, getWeek } from "./utils/date";
import useWindowSize from "./hooks/useWindowSize";
const MyCalendar = () => {
    const [prevWeek, setPrevWeek] = useState(() => {
        return loadSelectedWeek() || getWeek();
    });
    const [buttonPositionTop, setButtonPositionTop] = useState("0px");
    const [buttonPositionLeft, setButtonPositionLeft] = useState("50%");
    const { width } = useWindowSize();
    const navigate = useNavigate();
    const chooseWeek = (currDate) => {
        if (!currDate)
            return;
        const date = Array.isArray(currDate) ? currDate[0] : currDate;
        if (!date)
            return;
        const week = getWeek(date);
        console.log("week", week);
        setPrevWeek(week);
        saveSelectedWeek(week);
    };
    const navigateToTable = () => {
        navigate(formatWeekRangeToUrl(prevWeek));
    };
    useEffect(() => {
        setTimeout(() => {
            const activeDay = document.querySelector(".react-calendar__tile--active");
            if (activeDay) {
                const { top } = activeDay.getBoundingClientRect();
                setButtonPositionTop(`${top - 100}px`);
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
        setButtonPositionLeft(`${width / 2 + 175}px`);
    }, [width]);
    return (_jsxs("div", { className: styles["calendar-wrapper"], children: [_jsx(Calendar, { onChange: chooseWeek, value: prevWeek, allowPartialRange: true }), _jsx("div", { style: {
                    position: "absolute",
                    top: buttonPositionTop,
                    left: buttonPositionLeft,
                }, children: _jsxs("div", { className: styles["button-forward-wrapper"], onClick: navigateToTable, children: [_jsx("img", { src: buttonForward, alt: "button-forward", width: 38, height: 38 }), _jsx("button", { className: styles["button-calendar__forward"], type: "button" })] }) })] }));
};
export default MyCalendar;
