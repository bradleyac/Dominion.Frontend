import { JSX } from "react";
import { CardInstance, selectInPlay } from "../board/boardSlice";
import { Card } from "../card/Card";
import styles from "./PlayArea.module.css";
import { useAppSelector } from "../../app/hooks";

export const PlayArea = (): JSX.Element => {
  const inPlay = useAppSelector(selectInPlay);

  if (inPlay.length == 0) {
    return <></>;
  }

  const cards = inPlay.map((cardInstance: CardInstance) => (
    <Card
      cardId={cardInstance.cardId}
      cardInstanceId={cardInstance.instanceId}
      key={cardInstance.instanceId}
      isCompact={false}
      zone="Play"
    />
  ));

  return (
    <div className={styles.playArea}>
      <div className={styles.title}>Play Area</div>
      <div className={styles.inPlay}>{cards}</div>
    </div>
  );
};
