import { JSX } from "react";
import { CardInstance, CardPileState, selectDeck, selectDiscard } from "../board/boardSlice";
import { type CardData } from "../board/cards";
import styles from "./Card.module.css"

export const CardPile = ({ cardPile, gridArea, onClick }: { cardPile: CardPileState, gridArea: string, onClick: (cardId: number) => void }): JSX.Element => {
    return (
        <div className={styles.cardPile} key={cardPile.card.id} style={{ gridArea: gridArea }} onClick={() => onClick(cardPile.card.id)}>
            <Card card={cardPile.card} isCompact={true} />
            <div className={styles.remaining}>{cardPile.remaining}</div>
        </div>
    );
}

export const DiscardPile = ({ discard }: { discard: CardInstance[] }): JSX.Element => {
    const lastCard = discard.length > 0 ? discard.at(-1) : null;
    return (
        <div className={styles.discard}>
            <div className={styles.title}>Discard</div>
            {lastCard
                ? <Card card={lastCard.card} isCompact={false} />
                : <div className={`${styles.card} ${styles.white}`}></div>}
            <div className={styles.remaining}>{discard.length}</div>
        </div>
    );
}

export const Deck = ({ deck }: { deck: CardInstance[] }): JSX.Element => {
    return (
        <div className={styles.deck}>
            <div className={styles.title}>Deck</div>
            <div className={`${styles.card} ${deck.length === 0 ? styles.white : styles.cardBack}`}></div>
            <div className={styles.remaining}>{deck.length}</div>
        </div >
    );
}

export const Card = ({ card, isCompact, onClick }: { card: CardData, isCompact: boolean, onClick?: () => void }): JSX.Element => {
    return (
        <div className={`${styles.card} ${styles.cardFront} ${isCompact ? styles.compact : ""}`} style={{ backgroundImage: `url(${card.imgSrc})` }} onClick={onClick}>
            {/* <h1 className={styles.name}>{card.name}</h1>
            <p className={styles.text}>{card.text}</p>
            <p className={styles.cost}>Cost: {card.cost}</p>
            <p className={styles.types}>{card.types.join(", ")}</p> */}
        </div>
    );
}