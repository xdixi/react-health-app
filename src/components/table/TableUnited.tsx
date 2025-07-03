import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles/TableUnited2.module.scss";
import { getCurrentWeek } from "./utils/date";
import type { DayDataKeys, WeekData } from "./types";
import Button from "../UI/button";
import TableRow from "./TableRow";

import tooltipIcon from "../../assets/icons/buttons/tooltip.png";
import Tooltip from "../UI/tooltip";
import TableWeekInfo from "./TableWeekInfo";

interface Cell {
  row: number;
  key: DayDataKeys;
}

const TableUnited = () => {
  const [actualWeek, setActualWeek] = useState<WeekData>([]);
  const [activeCell, setActiveCell] = useState<Cell | null>(null);

  const navigate = useNavigate();
  const { week } = useParams();

  const navigateToCalendar = () => {
    navigate("/calendar");
  };

  useEffect(() => {
    if (!week) {
      navigate("/error");
      return;
    }

    const isValidWeek =
      /^(\d{4})\.(\d{1,2})\.(\d{1,2})-(\d{4})\.(\d{1,2})\.(\d{1,2})$/.test(
        week
      );

    if (!isValidWeek) {
      navigate("/error");
      return;
    }

    setActualWeek(getCurrentWeek(week));
  }, [week]);

  return (
    <div className={styles["table-container"]}>
      <Button onClick={navigateToCalendar} style={{ marginBottom: "20px" }}>
        К календарю
      </Button>
      <table className={styles["table"]}>
        <thead>
          <tr>
            <th className={styles["table__date"]}>Дата</th>
            <th className={styles["table__rest"]}>Сон</th>
            <th className={styles["table__pressure"]}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Давление и пульс
                <Tooltip
                  content={
                    <span>
                      Заполните поле в формате: <br /> 1) 07:00 – 110/80/60
                      проснулся <br />
                      2) 08:00 – 135/85/90 сразу после утренней пробежки
                    </span>
                  }
                  placement="right"
                >
                  <img src={tooltipIcon} alt="info" width={24} height={24} />
                </Tooltip>
              </div>
            </th>
            <th className={styles["table__wellBeing"]}>
              Самочувствие и оценка дня
            </th>
            <th className={styles["table__pills"]}>
              Тренировка и лучший результат
            </th>
          </tr>
        </thead>
        <tbody>
          {actualWeek.map((row, rowIndex) => (
            <TableRow
              key={Object.keys(row)[0]}
              rowIndex={rowIndex}
              rowData={row}
              activeCell={activeCell}
              setActiveCell={setActiveCell}
              actualWeek={actualWeek}
              setActualWeek={setActualWeek}
            />
          ))}
        </tbody>
      </table>
      <TableWeekInfo actualWeek={actualWeek} week={week} />
    </div>
  );
};

export default TableUnited;
