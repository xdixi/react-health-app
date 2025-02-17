import React, { useState } from "react";
import ModalPreasure from "../Modal-preasure/ModalPreasure";
import Clock from "../../components/clock/Clock";

export default function Rest({
  restTime,
  setRestTime,
  onChange,
  activeCell,
  value,
}) {
  const [modalActive, setModalActive] = useState(false);

  // const calcAngles = (value) => {
  //   let startAngleH = 0,
  //     startAngleM = 0,
  //     endAngleH = 0,
  //     endAngleM = 0;
  //   let startH = 0,
  //     startM = 0,
  //     endH = 0,
  //     endM = 0;
  //   startH = value.slice(0, 2).startsWith("0")
  //     ? value.slice(1, 2)
  //     : value.slice(0, 2);
  //   startM = value.slice(3, 5).startsWith("0")
  //     ? value.slice(4, 5)
  //     : value.slice(3, 5);
  //   endH = value.slice(8, 10).startsWith("0")
  //     ? value.slice(9, 10)
  //     : value.slice(8, 10);
  //   endM = value.slice(11).startsWith("0") ? value.slice(12) : value.slice(11);
  //   startAngleH = startH * 30;
  //   startAngleM = startM * 6;
  //   endAngleH = endH * 30;
  //   endAngleM = endM * 6;
  //   return [startAngleH, startAngleM, endAngleH, endAngleM];
  // };
  // calcAngles(value);
  return (
    <div>
      {value ? `Изменить время ${value}` : `Добавить время`}
      <button type="button" onClick={() => setModalActive((prev) => !prev)}>
        {value ? `Изменить время` : `Добавить время`}
      </button>
      <ModalPreasure active={modalActive} setActive={setModalActive}>
        <Clock
          width={200}
          onChange={onChange}
          restTime={restTime}
          setRestTime={setRestTime}
          activeCell={activeCell}
          start
        />
        <Clock
          width={200}
          onChange={onChange}
          setRestTime={setRestTime}
          restTime={restTime}
          activeCell={activeCell}
          start={false}
        />
      </ModalPreasure>
    </div>
  );
}
