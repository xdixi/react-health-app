import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router";
import MyCalendar from "./components/calendar/Calendar";
import TableVer2 from "./components/main-table/TableVer2";

function generateYearData(startYear) {
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
}

function App() {
  useEffect(() => {
    const storedData = localStorage.getItem("yearData2025");

    if (!storedData) {
      const yearData = generateYearData("2025");
      localStorage.setItem("yearData2025", JSON.stringify(yearData));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/calendar" replace />} />
        <Route path="/calendar" element={<MyCalendar />} />
        <Route path="/calendar/:week" element={<TableVer2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
