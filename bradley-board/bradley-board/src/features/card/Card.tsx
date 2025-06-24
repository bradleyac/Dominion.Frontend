import { JSX } from "react";
import { CardPileState } from "../board/boardSlice";
import type { CardData } from "../board/cards";
import styles from "./Card.module.css"

export const CardPile = ({ cardPile, fontSize, gridArea, onClick }: { cardPile: CardPileState, fontSize: number, gridArea: string, onClick: (cardId: number) => void }): JSX.Element => {
    return (
        <div className={styles.cardPile} key={cardPile.card.id} style={{ gridArea: gridArea, fontSize: fontSize }} onClick={() => onClick(cardPile.card.id)}>
            <Card card={cardPile.card} fontSize={fontSize} gridArea="card" isCompact={true} />
            <p style={{ gridArea: "remaining" }}>{cardPile.remaining}</p>
        </div>
    );
}

export const Card = ({ card, fontSize, gridArea, isCompact, onClick }: { card: CardData, fontSize: number, gridArea?: string, isCompact: boolean, onClick?: () => void }): JSX.Element => {
    return (
        <div className={`${styles.card} ${isCompact ? styles.compact : ""}`} style={{ fontSize: fontSize, gridArea: gridArea }} onClick={onClick}>
            <h1 className={styles.name} style={{ gridArea: "name", fontSize: fontSize }}>{card.name}</h1>
            <p className={styles.text} style={{ gridArea: "text" }}>{card.text}</p>
            <p className={styles.cost} style={{ gridArea: "cost" }}>Cost: {card.cost}</p>
            <p className={styles.types} style={{ gridArea: "types" }}>{card.types.join(", ")}</p>
        </div>
    );
}