import React, { useState } from "react";
import Clock from "../../components/clock/Clock";
import Modal from "../modal/Modal";

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

      <Modal active={modalActive} setActive={setModalActive}>
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
      </Modal>
    </div>
  );
}
