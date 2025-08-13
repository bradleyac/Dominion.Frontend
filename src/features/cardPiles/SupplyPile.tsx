import { JSX } from "react";
import { CardPileState } from "../game/gameSlice";
import { Card } from "../card/Card";
import styles from "./SupplyPile.module.css";

export const SupplyPile = ({
  cardPile,
  gridArea,
  isCompact = true,
}: {
  cardPile: CardPileState;
  gridArea: string;
  isCompact?: boolean;
}): JSX.Element => {
  return (
    <div
      className={styles.supplyPile}
      key={cardPile.cardId}
      style={{ gridArea: gridArea }}
    >
      <Card
        cardId={cardPile.cardId}
        isCompact={isCompact}
        count={cardPile.count}
        zone="Supply"
      />
    </div>
  );
};
