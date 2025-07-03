import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/reset.css";
import NotFound from "./pages/not-found/NotFound";
import Home from "./pages/home/Home";
import MyCalendar from "./pages/calendar/MyCalendar";
import Table from "./pages/table/Table";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/calendar" element={<MyCalendar />} />
        <Route path="/calendar/:week" element={<Table />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

{
  /* <Route path="*" element={<ErrorPage />} />
        <Route path="/" element={<Navigate to="/calendar" replace />} />
        <Route path="/calendar" element={<MyCalendar />} />
        <Route path="/calendar/:week" element={<TableVer2 />} /> */
}

// import React from "react";
// import { Routes, Route, BrowserRouter, Navigate } from "react-router";
// import MyCalendar from "./components/calendar/Calendar.tsx";
// import TableVer2 from "./components/main-table/TableVer2";
// import ErrorPage from "./components/error404/ErrorPage";
// import "./styles/reset.css";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="*" element={<ErrorPage />} />
//         <Route path="/" element={<Navigate to="/calendar" replace />} />
//         <Route path="/calendar" element={<MyCalendar />} />
//         <Route path="/calendar/:week" element={<TableVer2 />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
