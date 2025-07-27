import { JSX } from "react";
import { selectDeckCount } from "../board/boardSlice";
import { useAppSelector } from "../../app/hooks";
import styles from "./Deck.module.css";

export const Deck = (): JSX.Element => {
  const deckCount = useAppSelector(selectDeckCount);
  return (
    <div className={styles.deck}>
      <div className={styles.title}>Deck</div>
      <div className={`${styles.card} ${deckCount === 0 || styles.cardBack}`} />
      <div className={styles.remaining}>{deckCount}</div>
    </div>
  );
};
