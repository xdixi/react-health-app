import React, { useEffect, useState } from "react";
import styles from "./styles/TableUnited2.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { resetRestTime } from "../../store/slices/restTimeSlice";
import type { RootState, AppDispatch } from "../../store/store";
import Modal from "../UI/modal/Modal";
import { formatDateInTable } from "./utils/date";
import Clock from "../clock/Clock";
import { switchMonthEnding } from "./utils/moodChange";
import Button from "../UI/button";

import setTimeIcon from "../../assets/icons/clock/clock-set.png";

type RestProps = {
  onChange: (newValue: string, row: number, type: string) => void;
  activeCell: {
    row: number;
    col: number;
  };
  value: string;
  dateKey: string;
};

const RestColumn: React.FC<RestProps> = ({
  onChange,
  activeCell,
  value,
  dateKey,
}) => {
  const [modalActive, setModalActive] = useState(false);
  const [timeInModal, setTimeInModal] = useState<string>(
    value ? value : "00:00 - 00:00"
  );
  const [day, _, weekday] = formatDateInTable(dateKey);

  const setDisabledButtonClockSubmit = () => {
    return timeInModal.slice(0, 5) === timeInModal.slice(8);
  };

  const isDisabled = setDisabledButtonClockSubmit();

  const restTime = useSelector((state: RootState) => state.restTime.value);
  const dispatch = useDispatch<AppDispatch>();
  const setRestTimeHandler = () => {
    onChange(timeInModal, activeCell.row, "rest");
    setModalActive((prev) => !prev);
  };

  const resetRestTimeHandler = () => {
    dispatch(resetRestTime());
    onChange("", activeCell.row, "rest");
  };

  useEffect(() => {
    if (!value) {
      setTimeInModal("00:00 - 00:00");
    } else {
      setTimeInModal(value);
    }
  }, [modalActive]);

  return (
    <div className={styles["table__div-in-textarea__with-content"]}>
      {value ? (
        <>
          <p>{value}</p>
          <Button
            onClick={() => setModalActive(true)}
            style={{ marginTop: "15px", marginBottom: "15px" }}
          >
            Изменить время
          </Button>
          <Button
            onClick={() => {
              resetRestTimeHandler();
            }}
          >
            Сбросить время
          </Button>
        </>
      ) : (
        <Button
          onClick={() => setModalActive(true)}
          style={{ marginTop: "15px" }}
        >
          Добавить время
        </Button>
      )}

      <Modal isOpen={modalActive} onClose={() => setModalActive(false)}>
        <p style={{ textAlign: "center", marginBottom: "20px" }}>
          {`${day} ${switchMonthEnding(dateKey)}, ${weekday}`}
        </p>
        <Clock
          width={200}
          value={value}
          modalActive={modalActive}
          setTimeInModal={setTimeInModal}
          start
        ></Clock>
        <Clock
          width={200}
          value={value}
          modalActive={modalActive}
          setTimeInModal={setTimeInModal}
          start={false}
        ></Clock>
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
          <Button
            style={{
              marginLeft: "10px",
              padding: "4px",
              backgroundColor: isDisabled ? "gray" : "rgba(0, 128, 0, 0.7)",
              cursor: isDisabled ? "default" : "pointer",
            }}
            onClick={setRestTimeHandler}
            disabled={isDisabled}
          >
            ОК
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RestColumn;
