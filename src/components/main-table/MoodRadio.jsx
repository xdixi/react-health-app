import React from "react";
import classes from "./Table.module.css";

const MoodRadio = ({
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
        value={`${moodName.slice(1)}`}
        checked={row[dateKey][actualWeekKey] === moodName}
        onChange={() => handleMoodChange(rowIndex, dateKey, moodName)}
      />
    </div>
  );
};

export default MoodRadio;
