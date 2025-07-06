import React, { useState } from "react";
import styles from "./styles/TableUnited.module.scss";
import {
  averageMoodRating,
  averagePreasure,
  averageSleepDuration,
  formatDateInWeekInfo,
} from "./utils/calcAverage";
import Modal from "../UI/modal/Modal";

export type DayData = {
  sleepTime?: string;
  wakeTime?: string;
  pressureAndPulse?: string;
  wellBeing?: string;
  pills?: string;
  dayRating?: string;
};

export type WeekRow = {
  [date: string]: DayData;
};

interface TableWeekInfoProps {
  actualWeek: WeekRow[];
  week: string[];
}

const TableWeekInfo: React.FC<TableWeekInfoProps> = ({ actualWeek, week }) => {
  const [modalActive, setModalActive] = useState(false);

  const handleAveragePreasure = (obj: Record<string, string | null>) => {
    const txt = "в этот день не было ни одного измерения";
    return Object.keys(obj).map((day, i) => (
      <div key={i}>
        <p>
          {day}: {obj[day] ? obj[day] : txt}
        </p>
      </div>
    ));
  };

  return (
    <div className={styles["weekly-information"]}>
      <div className={styles["weekly-information--wrapper"]}>
        <p>{averageSleepDuration(actualWeek)}</p>
      </div>
      <div className={styles["weekly-information--wrapper"]}>
        <p>{averageMoodRating(actualWeek)[0]}</p>
        <img
          style={{ marginLeft: "10px" }}
          src={averageMoodRating(actualWeek)[1]}
          alt="week mood"
          width={"30px"}
          height={"30px"}
        />
      </div>
      <div className={styles["weekly-information--wrapper"]}>
        <p>{averagePreasure(actualWeek)[0]}. Больше информации</p>
        <button
          className={styles[`button-moreinfo`]}
          type="button"
          onClick={() => setModalActive(true)}
        ></button>
      </div>
      <Modal
        isOpen={modalActive}
        onClose={() => setModalActive((prev) => !prev)}
      >
        <p style={{ textAlign: "center" }}>
          Неделя: {formatDateInWeekInfo(week)[0]} -{" "}
          {formatDateInWeekInfo(week)[1]}
        </p>
        {handleAveragePreasure(averagePreasure(actualWeek)[1])}
      </Modal>
    </div>
  );
};

export default TableWeekInfo;
