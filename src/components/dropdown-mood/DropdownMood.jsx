import React, { useState } from "react";
import classes from "./Dropdown.module.css";

import badMood from "../../assets/icons/mood/1bad.png";
import sadMood from "../../assets/icons/mood/2sad.png";
import neutralMood from "../../assets/icons/mood/3neutral.png";
import happyMood from "../../assets/icons/mood/4happy.png";
import veryhappyMood from "../../assets/icons/mood/5veryhappy.png";
import noCommentMood from "../../assets/icons/mood/0no-comment.png";
import noMood from "../../assets/icons/mood/no.png";

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
      return noMood;
  }
};

const DropdownMood = ({
  value,
  options,
  renderItem,
  rowIndex,
  row,
  dateKey,
  handleMoodChange,
  actualWeekKey,
}) => {
  const [open, setOpen] = useState(false);

  const setSelectedOptionHandler = (mood) => {
    if (!mood) {
      console.error("Error: mood is undefined!");
      return;
    }
    handleMoodChange(rowIndex, dateKey, mood);
    setOpen(false);
  };
  return (
    <div className={classes["dropdown-wrapper"]}>
      <div className={classes.dropdown} onMouseLeave={() => setOpen(false)}>
        <div onClick={() => setOpen(false)} onMouseEnter={() => setOpen(true)}>
          {
            <img
              src={switchMoodImg(value)}
              alt="mood"
              width={"30px"}
              height={"30px"}
            />
          }
        </div>
        {open && (
          <ul>
            {options.map((mood) => {
              return renderItem(
                mood,
                setSelectedOptionHandler,
                rowIndex,
                row,
                dateKey,
                handleMoodChange,
                actualWeekKey
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DropdownMood;
