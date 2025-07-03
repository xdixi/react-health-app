import React, { useEffect, useState } from "react";
import Clock from "../../components/clock/Clock";
import Modal from "../modal/Modal";
import classes from "./Table.module.css";
import { formatLongDateInTable } from "../clock/utils";
import { useDispatch, useSelector } from "react-redux";
import { resetRestTime } from "../../store/slices/restTimeSlice";

export const Rest = ({ onChange, activeCell, value, dateKey }) => {
  const [modalActive, setModalActive] = useState(false);
  const [timeInModal, setTimeInModal] = useState(
    value ? value : "00:00 - 00:00"
  );
  const restTime = useSelector((state) => state.restTime.value);
  const dispatch = useDispatch();

  const setRestTimeHandler = () => {
    onChange(restTime, activeCell.row, "rest");
    setModalActive((prev) => !prev);
  };

  const resetRestTimeHandler = () => {
    dispatch(resetRestTime());
    onChange("", activeCell.row, "rest");
  };

  const setDisabledButtonClockSubmit = () => {
    return timeInModal.slice(0, 5) === timeInModal.slice(8);
  };

  useEffect(() => {
    if (!value) {
      setTimeInModal("00:00 - 00:00");
    } else {
      setTimeInModal(value);
    }
  }, [modalActive]);
  return (
    <div>
      {value ? value : ``}
      <div
        className={classes["tablerow-rest__setup"]}
        onClick={() => setModalActive((prev) => !prev)}
      >
        <p> {value ? `изменить время` : `Добавить время`}</p>
        <button
          className={
            value ? classes["button-clock-change"] : classes["button-clock-set"]
          }
          type="button"
        ></button>
      </div>
      {value && (
        <div
          className={classes["tablerow-rest__reset"]}
          onClick={() => resetRestTimeHandler()}
        >
          {" "}
          <p> {value ? `сбросить время` : null}</p>
          <button
            className={classes["button-clock-change-reset"]}
            type="button"
          ></button>
        </div>
      )}

      <Modal active={modalActive} setActive={setModalActive}>
        <p style={{ textAlign: "center", marginBottom: "10px" }}>
          {formatLongDateInTable(dateKey)[2]}
          {", "}
          {formatLongDateInTable(dateKey)[0]}{" "}
          {formatLongDateInTable(dateKey)[1]}
        </p>
        <Clock
          width={200}
          value={value}
          start
          setTimeInModal={setTimeInModal}
          modalActive={modalActive}
        />
        <Clock
          width={200}
          value={value}
          start={false}
          setTimeInModal={setTimeInModal}
          modalActive={modalActive}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>
            Установить время сна с {timeInModal.slice(0, 5)} до{" "}
            {timeInModal.slice(8)}
          </p>
          <button
            className={
              setDisabledButtonClockSubmit()
                ? classes["button-clock-ok__disabled"]
                : classes["button-clock-ok"]
            }
            type="button"
            onClick={setRestTimeHandler}
            disabled={setDisabledButtonClockSubmit()}
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Rest;
