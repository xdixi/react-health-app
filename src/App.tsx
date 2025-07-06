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
