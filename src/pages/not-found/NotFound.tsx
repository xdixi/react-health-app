import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.scss";
import type { FC } from "react";
import Button from "../../components/UI/button";

const NotFound: FC = () => {
  const navigate = useNavigate();

  const navigateToCalendar = () => {
    navigate("/calendar");
  };
  return (
    <div className={styles["error-page__wrapper"]}>
      page not found
      <Button
        className={styles["error-page__button"]}
        onClick={navigateToCalendar}
      >
        Вернуться к календарю
      </Button>
    </div>
  );
};
export default NotFound;
