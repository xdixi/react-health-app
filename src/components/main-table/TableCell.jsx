import React, { useEffect, useRef, useState } from "react";
import classes from "./Table.module.css";
import { setPositionButtonInTextarea } from "./utils";
import Rest from "./Rest";
import DropdownMood from "../dropdown-mood/DropdownMood";

// import badMood from "../../icons/1bad.png";
// import sadMood from "../../icons/2sad.png";
// import neutralMood from "../../icons/3neutral.png";
// import happyMood from "../../icons/4happy.png";
// import veryhappyMood from "../../icons/5veryhappy.png";
// import noCommentMood from "../../icons/0no-comment.png";

import badMood from "../../assets/icons/mood/1bad.png";
import sadMood from "../../assets/icons/mood/2sad.png";
import neutralMood from "../../assets/icons/mood/3neutral.png";
import happyMood from "../../assets/icons/mood/4happy.png";
import veryhappyMood from "../../assets/icons/mood/5veryhappy.png";
import noCommentMood from "../../assets/icons/mood/0no-comment.png";

const moods = [
  { id: 0, moodName: "0nocomment" },
  { id: 1, moodName: "1bad" },
  { id: 2, moodName: "2sad" },
  { id: 3, moodName: "3neutral" },
  { id: 4, moodName: "4happy" },
  { id: 5, moodName: "5veryhappy" },
];

const switchMoodImg = (mood) => {
  switch (mood) {
    case "1bad":
      return badMood;
    case "2sad":
      return sadMood;
    case "3neutral":
      return neutralMood;
    case "4happy":
      return happyMood;
    case "5veryhappy":
      return veryhappyMood;
    case "0nocomment":
      return noCommentMood;
    default:
      return noCommentMood;
  }
};

const TableCell = ({
  rowIndex,
  columnKey,
  value,
  isActive,
  onActivate,
  onChange,
  activeCell,
  setActiveCell,
  actualWeek,
  setActualWeek,
  setNumberlingHandler,
  handleMoodChange,
  dropDateKey,
  rowData,
}) => {
  const textAreaRef = useRef(null);
  const [textareaWidth, setTextareaWidth] = useState(0);
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

  const renderMoods = (
    moods,
    setSelectedOptionHandler,
    rowIndex,
    row,
    dateKey,
    handleMoodChange,
    actualWeekKey,
    moodName
  ) => {
    return (
      <li
        key={moods.id}
        onClick={() => setSelectedOptionHandler(moods.moodName)}
      >
        <input
          className={classes[`${moods.moodName.slice(1)}mood`]}
          type="radio"
          name={`mood-${rowIndex}`}
          id={`radio1-${rowIndex}`}
          value={`${moods.moodName.slice(1)}`}
          checked={row[dateKey][actualWeekKey] === moodName}
          onChange={() => handleMoodChange(rowIndex, dateKey, moodName)}
        />
      </li>
    );
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

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setTextareaWidth(entry.contentRect.width);
    });

    if (textAreaRef.current) {
      observer.observe(textAreaRef.current);
    }

    return () => {
      if (textAreaRef.current) {
        observer.unobserve(textAreaRef.current);
      }
    };
  });

  return (
    <td>
      {isActive ? (
        columnKey !== "rest" ? (
          <div
            className={classes["div-in-textarea"]}
            onClick={() => onActivate(rowIndex, columnKey, textAreaRef)}
            style={{
              padding: "0px",
            }}
          >
            <textarea
              ref={textAreaRef}
              value={value}
              onChange={(e) => onChange(e, rowIndex, columnKey)}
              onBlur={(e) => handleBlur(e, rowIndex, columnKey)}
              autoFocus
            />
            {columnKey === "wellBeing" && (
              <DropdownMood
                value={rowData[dropDateKey]["dayRating"] || "0nocomment"}
                options={moods}
                renderItem={renderMoods}
                key={rowIndex}
                rowIndex={rowIndex}
                row={rowData}
                dateKey={dropDateKey}
                handleMoodChange={handleMoodChange}
                actualWeekKey={"dayRating"}
              />
            )}
            <div
              style={{
                position: "absolute",
              }}
            >
              <button
                className={classes["button-remove"]}
                type="button"
              ></button>
              <button
                className={classes["button-agree"]}
                style={setPositionButtonInTextarea(
                  activeCell?.key,
                  textareaWidth
                )}
                type="button"
              ></button>
            </div>
          </div>
        ) : (
          <Rest
            onChange={onChange}
            activeCell={activeCell}
            value={value}
            dateKey={dropDateKey}
          />
        )
      ) : (
        <div onClick={() => onActivate(rowIndex, columnKey, textAreaRef)}>
          {value.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {line ? <br /> : ""}
            </React.Fragment>
          ))}
          {columnKey === "wellBeing" && (
            <div
              style={{
                float: "right",
                padding: "3px 12px 0 0",
              }}
            >
              <img
                src={switchMoodImg(rowData[dropDateKey]["dayRating"])}
                alt="mood"
                width={30}
              />
            </div>
          )}
        </div>
      )}
    </td>
  );
};

export default TableCell;
