import { JSX } from "react";
import { CardInstance, selectInPlay } from "../game/gameSlice";
import { Card } from "../card/Card";
import styles from "./PlayArea.module.css";
import { useAppSelector } from "../../app/hooks";
import { groupAdjacentCards } from "../../app/utils";

export const PlayArea = (): JSX.Element => {
  const inPlay = useAppSelector(selectInPlay);

  if (inPlay.length === 0) {
    return <></>;
  }

  const groupedCards = groupAdjacentCards(inPlay);

  const cards = groupedCards?.map((cards: CardInstance[]) => (
    <Card
      cardId={cards[0].cardId}
      cardInstanceId={cards[0].instanceId}
      key={cards[0].instanceId}
      isCompact={true}
      compactStyle="hideBottom"
      zone="Play"
      count={cards.length}
    />
  ));

  return (
    <div className={styles.playArea}>
      {/* <div className={styles.title}>Play Area</div> */}
      <div className={styles.inPlay}>{cards}</div>
    </div>
  );
};
