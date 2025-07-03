import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/TableUnited2.module.scss";
import { setPositionButtonInTextarea } from "./utils/positionHandlers";
import type { DayDataKeys, DayEntry, WeekData } from "./types";
import { updateDataInStorage } from "./utils/storage";
import { addNumberingInPressureColumn } from "./utils/autocompleteInPressureColumn";
import { handleMoodChange, switchMoodImg } from "./utils/moodChange";
import DropdownMood, { type MoodType } from "../dropdown-mood/DropdownMood";
import RestColumn from "./RestColumn";

interface Cell {
  row: number;
  key: DayDataKeys;
}

interface TableCellProps {
  rowIndex: number;
  columnKey: string;
  value: string;
  activeCell: Cell | null;
  setActiveCell: (cell: Cell | null) => void;
  actualWeek: WeekData;
  setActualWeek: React.Dispatch<React.SetStateAction<WeekData>>;
  dateKey: string;
  rowData: DayEntry;
}

const TableCell: React.FC<TableCellProps> = ({
  rowIndex,
  columnKey,
  value,
  activeCell,
  setActiveCell,
  actualWeek,
  setActualWeek,
  dateKey,
  rowData,
}) => {
  const [textareaWidth, setTextareaWidth] = useState(0);
  const [numberlingHandler, setNumberlingHandler] = useState(0); // в помощь для определения втавки порядкового номера
  const [numberlingHandler2, setNumberlingHandler2] = useState(false); // автовставка '1)' при пустой строке
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const isActive =
    activeCell?.row === rowIndex && activeCell?.key === columnKey;

  const removeTextButton = (
    e: React.ChangeEvent<HTMLTextAreaElement> | string,
    rowIndex: number,
    key: DayDataKeys
  ) => {
    const updatedDataWeek = [...actualWeek];
    const dateKey = Object.keys(actualWeek[rowIndex])[0];

    // Универсальный способ получить значение
    const newValue = typeof e === "string" ? "" : "";

    updatedDataWeek[rowIndex][dateKey][key] = newValue;
    setActualWeek(updatedDataWeek);

    updateDataInStorage(dateKey, updatedDataWeek);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLTextAreaElement> | string,
    rowIndex: number,
    key: DayDataKeys
  ) => {
    const updatedDataWeek = [...actualWeek];
    const dateKey = Object.keys(actualWeek[rowIndex])[0];
    const area = textAreaRef.current;

    // Если e — строка, просто выходим (или логика по нужде)
    if (typeof e === "string") return;

    const related = e.relatedTarget as HTMLElement | null;

    if (related && related.className.includes("button-remove")) {
      removeTextButton(e, rowIndex, key);
      setActiveCell({ row: rowIndex, key });
      area?.focus(); // безопасный вызов
    } else if (
      related &&
      related.className.includes("button-agree") &&
      updatedDataWeek[rowIndex][dateKey][key] === "1)" &&
      key === "pressureAndPulse"
    ) {
      setActiveCell(null);
      updatedDataWeek[rowIndex][dateKey][key] = "";
    } else if (related && related.className.includes("button-agree")) {
      setActiveCell(null);
    } else {
      if (
        updatedDataWeek[rowIndex][dateKey][key] === "1)" &&
        key === "pressureAndPulse"
      ) {
        updatedDataWeek[rowIndex][dateKey][key] = "";
      }
      setActualWeek(updatedDataWeek);
    }
  };

  const handleCellClick = (
    rowIndex: number,
    key: DayDataKeys,
    ref: React.RefObject<HTMLTextAreaElement>
  ): void => {
    const updatedDataWeek = [...actualWeek];
    const dateKey = Object.keys(actualWeek[rowIndex])[0]; // Дата

    if (
      !updatedDataWeek[rowIndex][dateKey][key] &&
      key === "pressureAndPulse"
    ) {
      updatedDataWeek[rowIndex][dateKey][key] = "1)";
    }

    setActualWeek(updatedDataWeek);
    setActiveCell({ row: rowIndex, key });

    // Переносим фокус в useEffect, чтобы синхронизировать состояние
    if (ref.current) {
      ref.current.focus();
    }
  };

  const handleCellChange = (
    e: React.ChangeEvent<HTMLTextAreaElement> | string,
    rowIndex: number,
    key: DayDataKeys
  ) => {
    const updated = [...actualWeek];
    const dateKey = Object.keys(actualWeek[rowIndex])[0];
    const prevValue = updated[rowIndex][dateKey][key];
    const newValue = getUpdatedValue(e, key, prevValue, rowIndex);

    updated[rowIndex][dateKey][key] = newValue;

    setActualWeek(updated);
    setActiveCell({ row: rowIndex, key });

    updateDataInStorage(dateKey, updated[rowIndex]);
  };

  const getUpdatedValue = (
    e: React.ChangeEvent<HTMLTextAreaElement> | string,
    key: DayDataKeys,
    value: string,
    rowIndex: number
  ) => {
    if (typeof e === "string") return e;
    const base = e.target.value;

    if (key !== "pressureAndPulse") return base;

    const serial = addNumberingInPressureColumn(
      actualWeek,
      rowIndex,
      setNumberlingHandler
    );
    console.log("serial", serial);
    if (serial && serial === numberlingHandler) {
      setNumberlingHandler(0);
      return base + `${serial})`;
    }

    if (base === "") {
      setNumberlingHandler2(true);
      return "";
    }

    if (numberlingHandler2) {
      setNumberlingHandler2(false);
      return `1)${base}`;
    }

    return base;
  };

  useEffect(() => {
    if (activeCell && textAreaRef.current) {
      const textArea = textAreaRef.current;

      if (!textArea.dataset.cursorInitialized) {
        const length = textArea.value.length;
        textArea.setSelectionRange(length, length);
        textArea.dataset.cursorInitialized = "true";
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.key === "Enter" && !e.shiftKey) || e.key === "Escape") {
          setActiveCell(null);
          textArea.blur();
        } else if (
          e.key === "Enter" &&
          e.shiftKey &&
          activeCell.key === "pressureAndPulse"
        ) {
          const row = activeCell.row;
          addNumberingInPressureColumn(actualWeek, row, setNumberlingHandler);
        }
      };

      const handleBlur = (_e: FocusEvent) => {
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
            className={styles["table__div-in-textarea"]}
            onClick={() => handleCellClick(rowIndex, columnKey, textAreaRef)}
          >
            <textarea
              className={`${styles["table__textarea"]} ${
                columnKey === "wellBeing"
                  ? styles["table__textarea--wellBeing"]
                  : ""
              }`}
              ref={textAreaRef}
              value={value}
              onChange={(e) => handleCellChange(e, rowIndex, columnKey)}
              onBlur={(e) => handleBlur(e, rowIndex, columnKey)}
              autoFocus
            />
            {columnKey === "wellBeing" && (
              <DropdownMood
                value={
                  (rowData[dateKey]?.["dayRating"] as MoodType) || "0nocomment"
                }
                onChange={(newMood) =>
                  handleMoodChange(
                    rowIndex,
                    dateKey,
                    newMood,
                    actualWeek,
                    setActualWeek
                  )
                }
              />
            )}
            <div
              style={{
                position: "absolute",
              }}
            >
              <button className={styles["button-agree"]} type="button"></button>
              <button
                className={styles["button-remove"]}
                style={setPositionButtonInTextarea(
                  activeCell?.key,
                  textareaWidth
                )}
                type="button"
              ></button>
            </div>
          </div>
        ) : (
          <RestColumn
            onChange={handleCellChange}
            activeCell={activeCell}
            value={value}
            dateKey={dateKey}
          />
        )
      ) : (
        <div
          className={
            columnKey === "wellBeing"
              ? styles["table__div-in-textarea__with-content--wellBeing"]
              : styles["table__div-in-textarea__with-content"]
          }
          onClick={() => handleCellClick(rowIndex, columnKey, textAreaRef)}
        >
          {value.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {line ? <br /> : ""}
            </React.Fragment>
          ))}
          {columnKey === "wellBeing" && (
            <div className={styles["table__mood-icon"]}>
              <img
                src={switchMoodImg(rowData[dateKey]["dayRating"])}
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
