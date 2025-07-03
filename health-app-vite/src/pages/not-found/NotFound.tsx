import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.scss";
import type { FC } from "react";

const NotFound: FC = () => {
  const navigate = useNavigate();

  const navigateToCalendar = () => {
    navigate("/calendar");
  };
  return (
    <div className={styles["error-page__wrapper"]}>
      page not found
      <button
        className={styles["error-page__button"]}
        onClick={navigateToCalendar}
        type="button"
      >
        Вернуться к календарю
      </button>
    </div>
  );
};
export default NotFound;
