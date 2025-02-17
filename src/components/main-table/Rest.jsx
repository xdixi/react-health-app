import React, { useState } from "react";
import ModalPreasure from "../modal-preasure/ModalPreasure";
import Clock from "../../components/clock/Clock";

export default function Rest({
  restTime,
  setRestTime,
  onChange,
  activeCell,
  value,
}) {
  const [modalActive, setModalActive] = useState(false);

  return (
    <div>
      {value ? value : ``}
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
