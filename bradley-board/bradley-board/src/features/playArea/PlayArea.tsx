import { JSX } from "react";
import { CardInstance, selectInPlay } from "../board/boardSlice";
import { Card } from "../card/Card";
import styles from "./PlayArea.module.css";
import { useAppSelector } from "../../app/hooks";

export const PlayArea = (): JSX.Element => {
  const inPlay = useAppSelector(selectInPlay);
  const cards = inPlay.map((cardInstance: CardInstance) => {
    return (
      <Card card={cardInstance.card} key={cardInstance.id} isCompact={false} />
    );
  });

  return (
    <div className={styles.playArea}>
      <div className={styles.title}>Play Area</div>
      <div className={styles.inPlay}>{cards}</div>
    </div>
  );
};
