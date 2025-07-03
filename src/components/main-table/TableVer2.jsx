import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./Table.module.css";
import TableRow from "./TableRow";
import { setPositionButtonInTextarea } from "./utils";
import TableWeekInfo from "./TableWeekInfo";
import Tooltip from "./Tooltip";
import iconCalendar from "../../assets/icons/calendar/calendar.png";

const getCurrentWeek = (week) => {
  const storedData = JSON.parse(localStorage.getItem("yearData2025"));

  const [start, end] = week.split("-");

  const startDate = new Date(start);
  const endDate = new Date(end);

  const currentWeek = storedData.filter((day) => {
    let dateKey = Object.keys(day);
    let currentDay = new Date(dateKey);
    return currentDay >= startDate && currentDay <= endDate;
  });

  return currentWeek;
};

const TableVer2 = () => {
  const [actualWeek, setActualWeek] = useState([]);
  const [activeCell, setActiveCell] = useState(null);
  const [numberlingHandler, setNumberlingHandler] = useState(0); // в помощь для определения втавки порядкового номера
  const [numberlingHandler2, setNumberlingHandler2] = useState(false); // автовставка '1)' при пустой строке

  let navigate = useNavigate();
  let { week } = useParams();

  const navigateToCalendar = () => {
    navigate("/");
  };

  const addNumberingInPreasureColumn = (currWeek, row) => {
    let nextNum = 0;
    currWeek.forEach((prop, i) => {
      if (row === i) {
        let preasureTxt = Object.values(prop)[0].preasure;
        Array.from(preasureTxt).forEach((_, i, str) => {
          if (str[i] === ")" && +str[i - 1] >= 0 && +str[i - 1] <= 9) {
            nextNum = +str[i - 1] + 1;
          }
        });
      }
    });
    setNumberlingHandler(nextNum);
    return nextNum;
  };

  const handleCellClick = (rowIndex, key, ref) => {
    const updatedDataWeek = [...actualWeek];
    const dateKey = Object.keys(actualWeek[rowIndex])[0]; // Дата
    if (!updatedDataWeek[rowIndex][dateKey][key] && key === "preasure") {
      updatedDataWeek[rowIndex][dateKey][key] = "1)";
    }
    setActualWeek(updatedDataWeek);
    setPositionButtonInTextarea(activeCell);
    setActiveCell({ row: rowIndex, key: key });
    const area = ref.current;
    if (area) {
      area.focus();
    }
  };

  const handleCellChange = (e, rowIndex, key) => {
    let serialNumber = addNumberingInPreasureColumn(actualWeek, rowIndex);
    const updatedDataWeek = [...actualWeek];
    const dateKey = Object.keys(actualWeek[rowIndex])[0]; // Дата
    if (
      serialNumber &&
      numberlingHandler === serialNumber &&
      key === "preasure"
    ) {
      serialNumber = String(serialNumber) + `)`;
      updatedDataWeek[rowIndex][dateKey][key] = e.target.value + serialNumber;
    } else if (typeof e === "object") {
      updatedDataWeek[rowIndex][dateKey][key] = e.target.value;
      setNumberlingHandler(0);
    }
    if (updatedDataWeek[rowIndex][dateKey][key] === "" && key === "preasure") {
      setNumberlingHandler2(true);
    }
    if (
      updatedDataWeek[rowIndex][dateKey][key] &&
      numberlingHandler2 &&
      key === "preasure"
    ) {
      updatedDataWeek[rowIndex][dateKey][key] = "1)" + e.target.value;
      setNumberlingHandler2(false);
    }
    if (typeof e !== "object") {
      updatedDataWeek[rowIndex][dateKey][key] = e;
    }

    setActiveCell({ row: rowIndex, key });
    setActualWeek(updatedDataWeek);

    const storedData = JSON.parse(localStorage.getItem("yearData2025"));
    const updatedYearData = storedData.map((day) => {
      const dayKey = Object.keys(day)[0];
      if (dateKey === dayKey) {
        return updatedDataWeek[rowIndex];
      }
      return day;
    });
    localStorage.setItem("yearData2025", JSON.stringify(updatedYearData));
  };

  const handleMoodChange = (rowIndex, date, moodValue) => {
    if (moodValue === undefined) return;
    const key = "dayRating";

    setActualWeek((prevWeek) => {
      const updatedDataWeek = prevWeek.map((day, idx) => {
        if (idx === rowIndex) {
          return {
            ...day,
            [date]: {
              ...day[date],
              [key]: moodValue === "0nocomment" ? "" : moodValue,
            },
          };
        }
        return day;
      });
      return updatedDataWeek;
    });
    const updatedDataWeek = [...actualWeek];
    updatedDataWeek[rowIndex][date][key] =
      moodValue === "0nocomment" ? "" : moodValue;
    const storedData = JSON.parse(localStorage.getItem("yearData2025"));
    const updatedYearData = storedData.map((day) => {
      const dayKey = Object.keys(day)[0];
      if (date === dayKey) {
        return updatedDataWeek[rowIndex];
      }
      return day;
    });
    localStorage.setItem("yearData2025", JSON.stringify(updatedYearData));
  };

  useEffect(() => {
    const isValidWeek =
      /^(\d{4})\.(\d{1,2})\.(\d{1,2})-(\d{4})\.(\d{1,2})\.(\d{1,2})$/.test(
        week
      );
    if (!isValidWeek) {
      return navigate("/error");
    }
  }, []);

  useMemo(() => {
    setActualWeek(getCurrentWeek(week));
  }, []);

  return (
    <div style={{ marginLeft: "70px", marginTop: "40px", width: "" }}>
      <div
        style={{
          display: "inline-flex ",
          alignItems: "center",
          marginBottom: "10px",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={navigateToCalendar}
      >
        <button className={classes["button-return"]} type="button"></button>
        <span style={{ padding: "10px" }}>Вернуться к календарю</span>
        <img src={iconCalendar} alt="" width={20} height={20} />
      </div>
      <div style={{ display: "flex" }}>
        <table className={classes["table-main"]}>
          <thead>
            <tr>
              <th className={classes["table-data"]}>Дата</th>
              <th className={classes["table-sleep"]}>Сон</th>

              <th className={classes["table-preasure"]}>
                Давление и пульс
                <Tooltip content="Заполните поле в формате: 1)16:30 – 135/85/70 проснулся"></Tooltip>
              </th>

              <th className={classes["table-well-being"]}>
                Самочувствие и оценка дня
              </th>
              <th className={classes["table-farma"]}>other//</th>
            </tr>
          </thead>
          <tbody>
            {actualWeek.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                rowData={row}
                rowIndex={rowIndex}
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                onActivate={handleCellClick}
                onChange={handleCellChange}
                actualWeek={actualWeek}
                setActualWeek={setActualWeek}
                setNumberlingHandler={setNumberlingHandler}
                handleMoodChange={handleMoodChange}
              />
            ))}
          </tbody>
        </table>
      </div>
      <TableWeekInfo actualWeek={actualWeek} week={week} />
    </div>
  );
};

export default TableVer2;
