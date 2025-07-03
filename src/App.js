import React from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router";
import MyCalendar from "./components/calendar/Calendar.tsx";
import TableVer2 from "./components/main-table/TableVer2";
import ErrorPage from "./components/error404/ErrorPage";
import "./styles/reset.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<ErrorPage />} />
        <Route path="/" element={<Navigate to="/calendar" replace />} />
        <Route path="/calendar" element={<MyCalendar />} />
        <Route path="/calendar/:week" element={<TableVer2 />} />
      </Routes>
    </BrowserRouter>
  );
}
