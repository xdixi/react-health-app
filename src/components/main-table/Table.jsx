import React, { useEffect, useMemo, useRef, useState } from "react";
import classes from "./Table.module.css";
import {
  setPositionButtonInTextarea,
  formatDateInTable,
  averageSleepDuration,
  averageMoodRating,
  averagePreasure,
} from "./utilsForTable";
import { useNavigate, useParams } from "react-router-dom";
import ModalPreasure from "../Modal-preasure/ModalPreasure";

const moods = [
  { id: 1, moodName: "1bad" },
  { id: 2, moodName: "2sad" },
  { id: 3, moodName: "3neutral" },
  { id: 4, moodName: "4happy" },
  { id: 5, moodName: "5veryhappy" },
];

function getCurrentWeek(week) {
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
}

export default function Table() {
  const [actualWeek, setActualWeek] = useState([]);
  const [numberlingHandler, setNumberlingHandler] = useState(0); // в помощь для определения втавки порядкового номера
  const textAreaRef = useRef(null);
  const [numberlingHandler2, setNumberlingHandler2] = useState(false); // автовставка '1)' при пустой строке
  const [activeCell, setActiveCell] = useState(null); // Активная ячейка {row, key}
  const [modalActive, setModalActive] = useState(false);
  let navigate = useNavigate();
  let { week } = useParams();
  console.log("first", week);
  const navigateToCalendar = () => {
    navigate("/");
  };

  const handleCellClick = (rowIndex, key) => {
    const updatedDataWeek = [...actualWeek];
    const dateKey = Object.keys(actualWeek[rowIndex])[0]; // Дата
    if (!updatedDataWeek[rowIndex][dateKey][key] && key === "preasure") {
      updatedDataWeek[rowIndex][dateKey][key] = "1)";
    }
    setActualWeek(updatedDataWeek);
    setPositionButtonInTextarea(activeCell);
    setActiveCell({ row: rowIndex, key: key });
    const area = textAreaRef.current;
    if (area) {
      area.focus();
    }
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
    } else {
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

  const removeTextButton = (e, rowIndex, key) => {
    const updatedDataWeek = [...actualWeek];
    const dateKey = Object.keys(actualWeek[rowIndex])[0];
    e.target.value = "";
    updatedDataWeek[rowIndex][dateKey][key] = e.target.value;
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

  const handleBlur = (e, rowIndex, key) => {
    const updatedDataWeek = [...actualWeek];
    const dateKey = Object.keys(actualWeek[rowIndex])[0]; // Дата
    const area = textAreaRef.current;
    if (
      e.relatedTarget &&
      e.relatedTarget.className.includes("button-remove")
    ) {
      removeTextButton(e, rowIndex, key);
      setActiveCell({ row: rowIndex, key });
      area.focus();
    } else if (
      e.relatedTarget &&
      e.relatedTarget.className.includes("button-agree") &&
      updatedDataWeek[rowIndex][dateKey][key] === "1)" &&
      key === "preasure"
    ) {
      setActiveCell(null);
      updatedDataWeek[rowIndex][dateKey][key] = "";
    } else if (
      e.relatedTarget &&
      e.relatedTarget.className.includes("button-agree")
    ) {
      setActiveCell(null);
    } else {
      if (
        updatedDataWeek[rowIndex][dateKey][key] === "1)" &&
        key === "preasure"
      ) {
        updatedDataWeek[rowIndex][dateKey][key] = "";
      }
      setActualWeek(updatedDataWeek);
    }
  };

  const handleMoodChange = (rowIndex, date, moodValue) => {
    const key = "dayRating";
    const updatedDataWeek = [...actualWeek];
    updatedDataWeek[rowIndex][date][key] = moodValue;
    setActualWeek(updatedDataWeek);
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

  const handleAveragePreasure = (obj) => {
    let txt = "в этот день не было ни одного измерения";
    return Object.keys(obj).map((day, i) => {
      return (
        <div key={i}>
          <p>
            {day}: {obj[day] ? obj[day] : txt}
          </p>
        </div>
      );
    });
  };

  useEffect(() => {
    if (activeCell && textAreaRef.current) {
      const textArea = textAreaRef.current;

      if (!textArea.dataset.cursorInitialized) {
        const length = textArea.value.length;

        textArea.setSelectionRange(length, length);
        textArea.dataset.cursorInitialized = "true";
      }
      const handleKeyDown = (e) => {
        if ((e.key === "Enter" && !e.shiftKey) || e.key === "Escape") {
          setActiveCell(null);
          textArea.blur();
        } else if (
          e.key === "Enter" &&
          e.shiftKey &&
          activeCell.key === "preasure"
        ) {
          const row = activeCell.row;
          addNumberingInPreasureColumn(actualWeek, row);
        }
      };

      const handleBlur = () => {
        delete textArea.dataset.cursorInitialized;
      };

      textArea.addEventListener("keydown", handleKeyDown);
      textArea.addEventListener("blur", handleBlur);

      return () => {
        textArea.removeEventListener("keydown", handleKeyDown);
        textArea.removeEventListener("blur", handleBlur);
      };
    }
  }, [activeCell]);

  useMemo(() => {
    setActualWeek(getCurrentWeek(week));
  }, []);

  return (
    <div>
      <button onClick={navigateToCalendar} type="button">
        Вернуться к календарю
      </button>
      <div style={{ display: "flex" }}>
        <table className={classes["table-main"]}>
          <thead>
            <tr>
              <th className={classes["table-data"]}>Дата 22:30 - 08:40</th>
              <th className={classes["table-sleep"]}>Сон</th>
              <th className={classes["table-preasure"]}>Давление и пульс</th>
              <th className={classes["table-well-being"]}>Самочувствие</th>
              <th className={classes["table-farma"]}>Таблетки</th>
            </tr>
          </thead>
          <tbody>
            {actualWeek.map((row, rowIndex) => {
              const dateKey = Object.keys(row)[0]; // Дата
              const rowData = row[dateKey];
              return (
                <tr key={rowIndex}>
                  <td>
                    {formatDateInTable(dateKey)[0]}
                    <br />
                    {formatDateInTable(dateKey)[1]}
                    <br />
                    {formatDateInTable(dateKey)[2]}
                  </td>

                  {Object.keys(rowData)
                    .filter((key) => key !== "dayRating")
                    .map((key) => (
                      <td key={key}>
                        {activeCell?.row === rowIndex &&
                        activeCell?.key === key ? (
                          <div
                            onClick={() => handleCellClick(rowIndex, key)}
                            className={classes["div-in-textarea"]}
                          >
                            <textarea
                              ref={textAreaRef}
                              value={rowData[key]}
                              onChange={(e) =>
                                handleCellChange(e, rowIndex, key)
                              }
                              onBlur={(e) => handleBlur(e, rowIndex, key)}
                              autoFocus
                            />
                            <button
                              className={classes["button-remove"]}
                              type="button"
                            ></button>
                            <button
                              className={classes["button-agree"]}
                              style={setPositionButtonInTextarea(
                                activeCell?.key
                              )}
                              type="button"
                            ></button>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleCellClick(rowIndex, key)}
                            dangerouslySetInnerHTML={{
                              __html: rowData[key].replace(/\n/g, "<br>"),
                            }}
                          ></div>
                        )}
                      </td>
                    ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <table className={classes["table-moods"]}>
          <tbody>
            {actualWeek.map((row, rowIndex) => {
              const dateKey = Object.keys(row)[0]; // Дата
              return (
                <tr key={rowIndex}>
                  <td className={classes["table-moods--td"]}>
                    {moods.map((m) => (
                      <MoodInput
                        key={m.id}
                        rowIndex={rowIndex}
                        row={row}
                        dateKey={dateKey}
                        handleMoodChange={handleMoodChange}
                        actualWeekKey={"dayRating"}
                        moodName={m.moodName}
                      />
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      ;
      <div className={classes["weekly-information"]}>
        <div>
          <p>{averageSleepDuration(actualWeek)}</p>
          <div style={{ display: "flex" }}>
            {" "}
            <p>{averageMoodRating(actualWeek)[0]}</p>
            <img
              style={{ paddingLeft: "10px", paddingTop: "10px" }}
              src={averageMoodRating(actualWeek)[1]}
              alt=""
              width={"30px"}
              height={"30px"}
            />
          </div>
          <div style={{ display: "flex" }}>
            <p>{averagePreasure(actualWeek)[0]}. Больше информации</p>
            <button
              className={classes[`button-moreinfo`]}
              type="button"
              onClick={() => setModalActive(true)}
            ></button>{" "}
          </div>
        </div>
      </div>
      <button type="button">DADADA</button>
      <button type="button">DADADA</button>;
      <ModalPreasure active={modalActive} setActive={setModalActive}>
        {handleAveragePreasure(averagePreasure(actualWeek)[1])}
      </ModalPreasure>
    </div>
  );
}

const MoodInput = ({
  rowIndex,
  row,
  dateKey,
  handleMoodChange,
  actualWeekKey,
  moodName,
}) => {
  return (
    <div className={classes["div-mood"]}>
      <input
        className={classes[`${moodName.slice(1)}mood`]}
        type="radio"
        name={`mood-${rowIndex}`}
        id={`radio1-${rowIndex}`}
        value="bad"
        checked={row[dateKey][actualWeekKey] === moodName}
        onChange={() => handleMoodChange(rowIndex, dateKey, moodName)}
      />
    </div>
  );
};
