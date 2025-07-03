import TableCell from "./TableCell";
import type { DayData, DayDataKeys, DayEntry, WeekData } from "./types";
import { formatDateInTable } from "./utils/date";

interface Cell {
  row: number;
  key: DayDataKeys;
}

interface TableRowProps {
  rowIndex: number;
  rowData: DayEntry;
  activeCell: Cell | null;
  setActiveCell: (cell: Cell | null) => void;
  actualWeek: WeekData;
  setActualWeek: React.Dispatch<React.SetStateAction<WeekData>>;
}

const TableRow: React.FC<TableRowProps> = ({
  rowIndex,
  rowData,
  activeCell,
  setActiveCell,
  actualWeek,
  setActualWeek,
}) => {
  const dateKey = Object.keys(rowData)[0];
  const row = rowData[dateKey];
  const [day, month, weekday] = formatDateInTable(dateKey);

  return (
    <tr>
      <td>
        {day}
        <br />
        {month}
        <br />
        {weekday}
      </td>
      {Object.keys(row)
        .filter((key) => key !== "dayRating")
        .map((key) => {
          const typedKey = key as keyof DayData;
          return (
            <TableCell
              key={key}
              rowIndex={rowIndex}
              columnKey={typedKey}
              value={row[typedKey]}
              activeCell={activeCell}
              setActiveCell={setActiveCell}
              actualWeek={actualWeek}
              setActualWeek={setActualWeek}
              dateKey={dateKey}
              rowData={rowData}
            />
          );
        })}
    </tr>
  );
};

export default TableRow;
