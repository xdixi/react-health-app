import React, { useState } from "react";
import classes from "./Table.module.css";

const Tooltip = ({ children, content }) => {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => {
    setVisible(true);
  };

  const hideTooltip = () => setVisible(false);

  return (
    <div
      className={classes["tooltip-wrapper"]}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}

      {visible && (
        <div
          className={classes["tooltip"]}
          style={{
            top: "50px",
            left: "45px",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
