import type { FC } from "react";
import styles from "./Home.module.scss";
import calendar_pic from "@assets/icons/home/calendar.png";
import notepad_pic from "@assets/icons/home/notepad.png";
import healthyLifestyle_pic from "@assets/icons/home/healthy-lifestyle.png";
import lineGraph_pic from "@assets/icons/home/line-graph.png";
import Button from "../../components/UI/button";
import { useNavigate } from "react-router-dom";

const pictures = [
  calendar_pic,
  notepad_pic,
  healthyLifestyle_pic,
  lineGraph_pic,
];

const altNames = [
  "Выбор недели в календаре",
  "Внесение данных в журнал",
  "Следование ЗОЖ",
  "График показателей здоровья",
];

const Home: FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles["home-page"]}>
      <h1 className={styles["home-page__title"]}>health diary</h1>
      <div className={styles["home-page__content"]}>
        <section className={styles["home-page__about"]}>
          <h3 className={styles["home-page__description"]}>
            Это простое и удобное приложение для мониторинга различных аспектов
            здоровья. Оно позволяет:
            <ul>
              <li>Выбирать неделю с помощью интерактивного календаря</li>
              <li>
                Ежедневно фиксировать данные о сне, давлении, пульсе,
                самочувствии и общей оценке дня,
                <br />а также о тренировках и результатах
              </li>
              <li>Отслеживать средние значения показателей за неделю</li>
            </ul>
          </h3>
        </section>
        <section className={styles["home-page__pics"]}>
          {pictures.map((pic, i) => (
            <img
              key={i}
              className={styles["home-page__pic"]}
              src={pic}
              alt={altNames[i]}
            />
          ))}
        </section>
      </div>
      <Button onClick={() => navigate("/calendar")} icon={"calendar"}>
        К календарю
      </Button>
    </div>
  );
};

export default Home;
