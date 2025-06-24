import { JSX, useEffect } from "react";
import { CardPile } from "../card/Card";
import styles from "./Board.module.css";
import { CardPileState, selectKingdomCards, buyCard, startGame } from "./boardSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks"

export const Board = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const kingdomCards = useAppSelector(selectKingdomCards);

  useEffect(() => {
    dispatch(startGame());
  }, [])

  const columnWidth = 100;
  const cardTextWidth = columnWidth * 1.5;
  const maxNameLength = 10;//kingdomCards.reduce((max, cardPile) => Math.max(max, cardPile.card.name.length), 0);
  const fontSize = cardTextWidth / maxNameLength;

  const piles = kingdomCards.map((cardPile: CardPileState) => (
    <CardPile cardPile={cardPile} fontSize={fontSize} key={cardPile.card.id} gridArea={cardPile.card.area ?? ""} onClick={(cardId: number) => dispatch(buyCard(cardId))} />
  ));

  return (
    <div className={styles.board} style={{ "--column-width": `${columnWidth}px` } as React.CSSProperties}>
      {piles}
      <div className={styles.vr} style={{ gridArea: "line" }}></div>
    </div>
  );
}