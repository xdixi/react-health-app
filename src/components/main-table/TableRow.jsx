import React from "react";
import { formatDateInTable } from "./utilsForTable";
import TableCell from "./TableCell";

const TableRow = ({
  rowData,
  rowIndex,
  activeCell,
  setActiveCell,
  onActivate,
  onChange,
  actualWeek,
  setActualWeek,
  setNumberlingHandler,
  restTime,
  setRestTime,
  handleMoodChange,
}) => {
  const dateKey = Object.keys(rowData)[0];
  const row = rowData[dateKey];
  const activeCellProp = activeCell;
  return (
    <tr key={rowIndex}>
      <td>
        {formatDateInTable(dateKey)[0]}
        <br />
        {formatDateInTable(dateKey)[1]}
        <br />
        {formatDateInTable(dateKey)[2]}
      </td>
      {Object.keys(row)
        .filter((key) => key !== "dayRating")
        .map((key) => (
          <TableCell
            key={key}
            rowIndex={rowIndex}
            columnKey={key}
            value={row[key]}
            isActive={activeCell?.row === rowIndex && activeCell?.key === key}
            onActivate={onActivate}
            onChange={onChange}
            activeCell={activeCellProp}
            setActiveCell={setActiveCell}
            actualWeek={actualWeek}
            setActualWeek={setActualWeek}
            setNumberlingHandler={setNumberlingHandler}
            restTime={restTime}
            setRestTime={setRestTime}
            handleMoodChange={handleMoodChange}
            dropDateKey={dateKey}
            rowData={rowData}
          />
        ))}
    </tr>
  );
};

export default TableRow;
