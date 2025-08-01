import { JSX } from "react";
import { CardPileState } from "../board/boardSlice";
import { Card } from "../card/Card";
import styles from "./SupplyPile.module.css";

export const SupplyPile = ({
  cardPile,
  gridArea,
}: {
  cardPile: CardPileState;
  gridArea: string;
}): JSX.Element => {
  return (
    <div
      className={styles.supplyPile}
      key={cardPile.cardId}
      style={{ gridArea: gridArea }}
    >
      <Card
        cardId={cardPile.cardId}
        isCompact={true}
        count={cardPile.count}
        zone="Supply"
      />
    </div>
  );
};
