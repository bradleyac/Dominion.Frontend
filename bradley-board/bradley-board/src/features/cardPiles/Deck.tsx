import { JSX } from "react";
import { selectDeck } from "../board/boardSlice";
import { useAppSelector } from "../../app/hooks";
import styles from "./Deck.module.css";

export const Deck = (): JSX.Element => {
  const deck = useAppSelector(selectDeck);
  return (
    <div className={styles.deck}>
      <div className={styles.title}>Deck</div>
      <div
        className={`${styles.card} ${deck.length === 0 ? styles.white : styles.cardBack}`}
      ></div>
      <div className={styles.remaining}>{deck.length}</div>
    </div>
  );
};
