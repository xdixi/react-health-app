import React from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router";
import MyCalendar from "./components/calendar/Calendar";
import TableVer2 from "./components/main-table/TableVer2";

function App() {
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
