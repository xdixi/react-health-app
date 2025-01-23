import React, { useEffect, useRef, useState } from "react";
import classes from "./DayInfo.module.css";

export default function DayInfo() {
  // const [textArea, setTextArea] = useState(false);
  // const [divArea, setDivArea] = useState(true);
  // const [divAreaText, setDivAreaText] = useState("");

  // const divRef = useRef(null);
  // const textAreaRef = useRef(null);

  // function editStart() {
  //   setDivArea(false);
  //   setTextArea(true);
  // }

  // function onBlurTextArea() {
  //   const area = textAreaRef.current;
  //   if (!area) return;
  //   setTextArea(false);
  //   setDivArea(true);
  // setDivAreaText(area.value);
  // }

  // function changeAreaHandler() {
  //   const area = textAreaRef.current;
  //   if (!area) return;
  //   area.onkeydown = function (e) {
  //     if (e.key === "Enter") {
  //       area.blur();
  //     }
  //   };
  //   setDivAreaText(area.value);
  // }

  return (
    <>
      <td>
        <div></div>
      </td>
      <td>
        <div></div>
      </td>
      <td>
        <div></div>
      </td>
      <td>
        <div></div>
      </td>
      <td>
        <div></div>
      </td>
      <td>
        <div></div>
      </td>
    </>
  );
}
