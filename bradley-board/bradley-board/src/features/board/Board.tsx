import { JSX, useEffect } from "react";
import { SupplyPile } from "../cardPiles/SupplyPile";
import styles from "./Board.module.css";
import { CardPileState, selectKingdomCards, startGame } from "./boardSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

export const Board = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const kingdomCards = useAppSelector(selectKingdomCards);

  useEffect(() => {
    dispatch(startGame(2));
  }, []);

  const piles = kingdomCards.map((cardPile: CardPileState) => (
    <SupplyPile
      cardPile={cardPile}
      key={cardPile.card.id}
      gridArea={cardPile.card.area ?? ""}
    />
  ));

  return (
    <div className={styles.board}>
      {piles}
      <div className={styles.vr} style={{ gridArea: "line" }}></div>
    </div>
  );
};
