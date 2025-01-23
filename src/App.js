import React, { useEffect } from "react";
import Table from "./components/main-table/Table";
import { Routes, Route, BrowserRouter, Navigate } from "react-router";
import MyCalendar from "./components/calendar/Calendar";
import MyComponent from "./components/MyComponent";

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
        pressure: "",
        afterWhichMeasured: "",
        wellBeing: "",
        pills: "",
        dayRating: {
          пн: "",
          вт: "",
          ср: "",
          чт: "",
          пт: "",
          сб: "",
          вс: "",
        },
      },
    };

    actualYear.push(dayData);
    actualDate.setDate(actualDate.getDate() + 1); // Увеличиваем дату на 1 день
  }

  return actualYear;
}

function App() {
  useEffect(() => {
    const storedData = localStorage.getItem("yearData2025");

    if (!storedData) {
      const yearData = generateYearData("2025");
      localStorage.setItem("yearData2025", JSON.stringify(yearData));
      console.log("yearData", yearData);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/calendar" replace />} />
        <Route path="/calendar" element={<MyCalendar />} />
        <Route path="/calendar/:week" element={<Table />} />
        <Route path="/asd" element={<MyComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
