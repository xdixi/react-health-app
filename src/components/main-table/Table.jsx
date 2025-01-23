import React, { useEffect, useMemo, useRef, useState } from "react";
import classes from "./Table.module.css";
import {
  setPositionButtonInTextarea,
  formatDateInTable,
  averageSleepDuration,
  showDayRating,
} from "./utilsForTable";
import { useNavigate, useParams } from "react-router-dom";

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
  const [selectedMoods, setSelectedMoods] = useState({});
  const textAreaRef = useRef(null);
  const inputMoodRef = useRef(null);
  const [activeCell, setActiveCell] = useState(null); // Активная ячейка {row, key}
  let navigate = useNavigate();
  let { week } = useParams();

  const navigateToCalendar = () => {
    navigate(`/`);
  };

  const handleCellClick = (rowIndex, key) => {
    setPositionButtonInTextarea(activeCell);
    setActiveCell({ row: rowIndex, key: key });
    const area = textAreaRef.current;
    if (area) {
      area.focus();
    }
  };

  const handleCellChange = (e, rowIndex, key) => {
    const updatedDataWeek = [...actualWeek];
    const dateKey = Object.keys(actualWeek[rowIndex])[0]; // Дата
    updatedDataWeek[rowIndex][dateKey][key] = e.target.value;
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
      e.relatedTarget.className.includes("button-agree")
    ) {
      setActiveCell(null);
    }
  };

  const handleMoodChange = (rowIndex, moodValue) => {
    setSelectedMoods((prevState) => ({
      ...prevState,
      [rowIndex]: moodValue,
    }));
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
              <th className={classes["table-preasure"]}>Давление</th>
              <th className={classes["table-preasure-after"]}>
                После чего измерял
              </th>
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
      </div>
      ;
      <div className={classes["weekly-information"]}>
        <div>
          <p>{averageSleepDuration(actualWeek)}</p>
        </div>
      </div>
      <button type="button">DADADA</button>
      <button type="button">DADADA</button>;
    </div>
  );
}

// const rowData = row[dateKey];
// Object.keys(rowData)
//   .filter((key) => key === "dayRating")
//   .map((key) => {
//     const dayOfWeek = rowData[key];

//     Object.keys(dayOfWeek).map((day) => {
//       console.log("day", day);
//     });
//   });

// return (
//   <tr key={rowIndex}>
//     <td>
//       {" "}
//       <div className={classes["div-mood"]}>
//         <input
//           className={classes.deadmood}
//           type="radio"
//           name={`mood-${rowIndex}`}
//           id={`radio1-${rowIndex}`}
//           value="dead"
//           checked={selectedMoods[weekdayRu] === "dead"}
//           onChange={() => handleMoodChange(weekdayRu, "dead")}
//         />
//       </div>
//       <div className={classes["div-mood"]}>
//         <input
//           className={classes.sadmood}
//           type="radio"
//           name={`mood-${rowIndex}`}
//           id={`radio2-${rowIndex}`}
//           value="sad"
//           checked={selectedMoods[weekdayRu] === "sad"}
//           onChange={() => handleMoodChange(weekdayRu, "sad")}
//         />
//       </div>
//       <div className={classes["div-mood"]}>
//         <input
//           className={classes.neutralmood}
//           type="radio"
//           name={`mood-${rowIndex}`}
//           id={`radio3-${rowIndex}`}
//           value="neutral"
//           checked={selectedMoods[weekdayRu] === "neutral"}
//           onChange={() => handleMoodChange(weekdayRu, "neutral")}
//         />
//       </div>
//       <div className={classes["div-mood"]}>
//         <input
//           className={classes.happymood}
//           type="radio"
//           name={`mood-${rowIndex}`}
//           id={`radio4-${rowIndex}`}
//           value="happy"
//           checked={selectedMoods[weekdayRu] === "happy"}
//           onChange={() => handleMoodChange(weekdayRu, "happy")}
//         />
//       </div>
//       <div className={classes["div-mood"]}>
//         <input
//           className={classes.veryhappymood}
//           type="radio"
//           name={`mood-${rowIndex}`}
//           id={`radio5-${rowIndex}`}
//           value="veryhappy"
//           checked={selectedMoods[weekdayRu] === "veryhappy"}
//           onChange={() =>
//             handleMoodChange(weekdayRu, "veryhappy")
//           }
//         />
//       </div>
//     </td>
//   </tr>
// );

// const Cell = ({ handleCellClick, rowIndex, id, rowData }) => {
//   return (
//     <div
//       onClick={() => handleCellClick(rowIndex, id)}
//       dangerouslySetInnerHTML={{
//         __html: rowData[id].replace(/\n/g, "<br>"),
//       }}
//     ></div>
//   );
// };

// const Textarea = ({
//   handleCellClick,
//   rowIndex,
//   id,
//   textAreaRef,
//   handleCellChange,
//   rowData,
//   handleBlur,
//   activeCell,
// }) => {
//   return (
//     <div
//       onClick={() => handleCellClick(rowIndex, id)}
//       className={classes["div-in-textarea"]}
//     >
//       <textarea
//         ref={textAreaRef}
//         value={rowData[id]}
//         onChange={(e) => handleCellChange(e, rowIndex, id)}
//         onBlur={(e) => handleBlur(e, rowIndex, id)}
//         autoFocus
//       />
//       <button className={classes["button-remove"]} type="button"></button>
//       <button
//         className={classes["button-agree"]}
//         style={setPositionButtonInTextarea(activeCell?.key)}
//         type="button"
//       ></button>
//     </div>
//   );
// };

// const DayRating = ({
//   handleCellClick,
//   rowIndex,
//   id,
//   inputMoodRef,
//   isShow,
//   rowData,
// }) => {
//   if (isShow(rowData) && id === "dayRating") {
//     return (
//       <div
//         className={classes["day-rating-container"]}
//         // onClick={() => handleCellClick(rowIndex, id)}
//       >
//         <div>
//           <input
//             ref={inputMoodRef}
//             className={classes.deadmood}
//             type="radio"
//             name={`mood-${id}`}
//             id="radio1"
//           />
//         </div>

//         <div>
//           <input
//             className={classes["sadmood"]}
//             type="radio"
//             name={`mood-${id}`}
//             id="radio2"
//           />
//         </div>
//         <div>
//           <input
//             className={classes["neutralmood"]}
//             type="radio"
//             name={`mood-${id}`}
//             id="radio3"
//           />
//         </div>
//         <div>
//           <input
//             className={classes["happymood"]}
//             type="radio"
//             name={`mood-${id}`}
//             id="radio4"
//           />
//         </div>
//         <div>
//           <input
//             className={classes["veryhappymood"]}
//             type="radio"
//             name={`mood-${id}`}
//             id="radio5"
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       onClick={() => handleCellClick(rowIndex, id)}
//       dangerouslySetInnerHTML={{
//         __html: rowData[id].replace(/\n/g, "<br>"),
//       }}
//     ></div>
//   );
// };
