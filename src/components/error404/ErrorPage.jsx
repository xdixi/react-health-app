import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  let navigate = useNavigate();

  const navigateToCalendar = () => {
    navigate("/");
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      page not found :(
      <div style={{ paddingLeft: "20px" }}>
        <button onClick={navigateToCalendar} type="button">
          Вернуться к календарю
        </button>
      </div>
    </div>
  );
};
export default ErrorPage;
