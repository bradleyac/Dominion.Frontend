import { JSX } from "react";
import { SupplyPile } from "../cardPiles/SupplyPile";
import styles from "./Board.module.css";
import { CardPileState, selectKingdomCards } from "../game/gameSlice";
import { useAppSelector } from "../../app/hooks";
import { gridAreaMap } from "../card/cards";

export const Board = (): JSX.Element => {
  const kingdomCards = useAppSelector(selectKingdomCards)!;
  let i = 1;
  const piles = kingdomCards?.map((cardPile: CardPileState) => (
    <SupplyPile
      cardPile={cardPile}
      key={cardPile.cardId}
      gridArea={gridAreaMap[cardPile.cardId] ?? `pile${i++}`}
    />
  ));

  return (
    <div className={styles.board}>
      {piles}
      <div className={styles.line}></div>
    </div>
  );
};
