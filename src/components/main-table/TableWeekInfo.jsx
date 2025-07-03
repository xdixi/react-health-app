import React, { useState } from "react";
import {
  averageMoodRating,
  averagePreasure,
  averageSleepDuration,
  formatDateInWeekInfo,
} from "./utils";
import classes from "./Table.module.css";
import Modal from "../modal/Modal";
import { formatLongDateInTable } from "../clock/utils";

const TableWeekInfo = ({ actualWeek, week }) => {
  const [modalActive, setModalActive] = useState(false);

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

  return (
    <div className={classes["weekly-information"]}>
      <div className={classes["weekly-information--wrapper"]}>
        <p>{averageSleepDuration(actualWeek)}</p>
      </div>
      <div className={classes["weekly-information--wrapper"]}>
        {" "}
        <p>{averageMoodRating(actualWeek)[0]}</p>
        <img
          style={{ marginLeft: "10px" }}
          src={averageMoodRating(actualWeek)[1]}
          alt="week mood"
          width={"30px"}
          height={"30px"}
        />
      </div>
      <div className={classes["weekly-information--wrapper"]}>
        <p>{averagePreasure(actualWeek)[0]}. Больше информации</p>
        <button
          className={classes[`button-moreinfo`]}
          type="button"
          onClick={() => setModalActive(true)}
        ></button>{" "}
      </div>
      <Modal active={modalActive} setActive={setModalActive}>
        <p style={{ textAlign: "center" }}>
          Неделя: {formatDateInWeekInfo(week)[0]} -{" "}
          {formatDateInWeekInfo(week)[1]}{" "}
        </p>
        {handleAveragePreasure(averagePreasure(actualWeek)[1])}
      </Modal>
    </div>
  );
};

export default TableWeekInfo;
