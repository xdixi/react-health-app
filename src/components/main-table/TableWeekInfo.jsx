import React, { useState } from "react";
import {
  averageMoodRating,
  averagePreasure,
  averageSleepDuration,
} from "./utilsForTable";
import classes from "./Table.module.css";
import ModalPreasure from "../modal-preasure/ModalPreasure";

const TableWeekInfo = ({ actualWeek }) => {
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
    <div>
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
      <ModalPreasure active={modalActive} setActive={setModalActive}>
        {handleAveragePreasure(averagePreasure(actualWeek)[1])}
      </ModalPreasure>
    </div>
  );
};

export default TableWeekInfo;
