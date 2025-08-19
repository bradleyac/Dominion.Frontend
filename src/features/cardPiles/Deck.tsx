import { JSX } from "react";
import { selectDeckCount } from "../game/gameSlice";
import { useAppSelector } from "../../app/hooks";
import styles from "./Deck.module.css";
import { ReactiveCount } from "../reactiveCount/ReactiveCount";

export const Deck = (): JSX.Element => {
  const deckCount = useAppSelector(selectDeckCount);
  return (
    <div className={styles.deck}>
      <div className={styles.title}>Deck</div>
      <div className={`${styles.card} ${deckCount === 0 || styles.cardBack}`} />
      <div className={styles.remaining}><ReactiveCount count={deckCount} /></div>
    </div>
  );
};
