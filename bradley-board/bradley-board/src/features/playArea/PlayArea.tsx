import { JSX } from "react";
import { CardInstance, selectFilterSatisfied, selectInPlay, submitSelectedCards } from "../board/boardSlice";
import { Card } from "../card/Card";
import styles from "./PlayArea.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

export const PlayArea = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const inPlay = useAppSelector(selectInPlay);
  let filterSatisfied = useAppSelector(selectFilterSatisfied);

  const cards = inPlay.map((cardInstance: CardInstance) => (
    <Card
      card={cardInstance}
      key={cardInstance.id}
      isCompact={false}
      zone="play"
    />
  ));

  return (
    <div className={styles.playArea}>
      <div className={styles.title}>Play Area</div>
      <div className={styles.inPlay}>{cards}
        {filterSatisfied && <div>
          <button onClick={() => dispatch(submitSelectedCards())}>Submit</button>
        </div>}
      </div>

    </div>
  );
};
