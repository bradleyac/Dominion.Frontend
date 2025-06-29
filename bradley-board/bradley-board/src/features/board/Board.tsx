import { JSX, useEffect } from "react";
import { CardPile } from "../card/Card";
import styles from "./Board.module.css";
import {
  CardPileState,
  selectKingdomCards,
  buyCard,
  startGame,
} from "./boardSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

export const Board = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const kingdomCards = useAppSelector(selectKingdomCards);

  useEffect(() => {
    dispatch(startGame(2));
  }, []);

  const piles = kingdomCards.map((cardPile: CardPileState) => (
    <CardPile
      cardPile={cardPile}
      key={cardPile.card.id}
      gridArea={cardPile.card.area ?? ""}
      onClick={(cardId: number) => dispatch(buyCard(cardId))}
    />
  ));

  return (
    <div className={styles.board}>
      {piles}
      <div className={styles.vr} style={{ gridArea: "line" }}></div>
    </div>
  );
};
