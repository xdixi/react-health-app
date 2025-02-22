import React from "react";
import classes from "./Modal.module.css";

export default function Modal({ active, setActive, children }) {
  return (
    <div
      className={`${classes.modal} ${active ? classes.active : ""}`}
      onClick={() => setActive(false)}
    >
      {" "}
      <div
        className={`${classes["modal__content"]} ${
          active ? classes["modal__content--active"] : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* <div>
          <button
            className={classes["button-close"]}
            type="button"
            onClick={() => setActive(false)}
          ></button>
        </div> */}

        <button
          className={classes["button-close"]}
          type="button"
          onClick={() => setActive(false)}
        ></button>
        <div>{children}</div>
      </div>
    </div>
  );
}
