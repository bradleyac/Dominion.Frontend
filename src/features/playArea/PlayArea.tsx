import { JSX, useState } from "react";
import { CardInstance, selectInPlay } from "../game/gameSlice";
import { Card } from "../card/Card";
import styles from "./PlayArea.module.css";
import { useAppSelector } from "../../app/hooks";
import { groupAdjacentCards } from "../../app/utils";

export const PlayArea = (): JSX.Element => {
  const inPlay = useAppSelector(selectInPlay);
  const [stacked, setStacked] = useState(true);

  if (inPlay.length === 0) {
    return <></>;
  }

  const groupedCards = groupAdjacentCards(inPlay);

  const cards = groupedCards?.map((cards: CardInstance[]) => (
    <Card
      cardId={cards[0].cardId}
      cardInstanceId={cards[0].instanceId}
      key={cards[0].instanceId}
      isCompact={stacked}
      zone="Play"
      count={cards.length}
    />
  ));

  return (
    <div
      className={styles.playArea}
      onClick={() => setStacked((stacked) => !stacked)}
    >
      <div className={`${styles.inPlay} ${stacked && styles.stacked}`}>
        {cards}
      </div>
    </div>
  );
};
