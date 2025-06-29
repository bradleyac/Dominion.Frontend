import { JSX } from "react";
import { CardPileState } from "../board/boardSlice";
import { Card } from "../card/Card";
import styles from "./SupplyPile.module.css";

export const CardPile = ({
  cardPile,
  gridArea,
  onClick,
}: {
  cardPile: CardPileState;
  gridArea: string;
  onClick: (cardId: number) => void;
}): JSX.Element => {
  return (
    <div
      className={styles.cardPile}
      key={cardPile.card.id}
      style={{ gridArea: gridArea }}
      onClick={() => onClick(cardPile.card.id)}
    >
      <Card card={cardPile.card} isCompact={true} />
      <div className={styles.remaining}>{cardPile.remaining}</div>
    </div>
  );
};
