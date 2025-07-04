import { JSX } from "react";
import { Card } from "../card/Card";
import { selectDiscard } from "../board/boardSlice";
import { useAppSelector } from "../../app/hooks";
import styles from "./Discard.module.css";

export const DiscardPile = (): JSX.Element => {
  const discard = useAppSelector(selectDiscard);
  const lastCard = discard.length > 0 ? discard.at(-1) : null;
  return (
    <div className={styles.discard}>
      <div className={styles.title}>Discard</div>
      {lastCard ? (
        <Card card={lastCard.card} isCompact={false} zone="discard" />
      ) : (
        <div className={`${styles.card} ${styles.white}`}></div>
      )}
      <div className={styles.remaining}>{discard.length}</div>
    </div>
  );
};
