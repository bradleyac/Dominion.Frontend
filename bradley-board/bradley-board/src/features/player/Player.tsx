import { JSX } from "react"
import { CardInstance, endTurn, playCard, PlayerResources, selectDeck, selectHand, selectResources } from "../board/boardSlice"
import { Card } from "../card/Card"
import styles from "./Player.module.css"
import { useAppDispatch, useAppSelector } from "../../app/hooks"

export const Resources = ({ resources }: { resources: PlayerResources }): JSX.Element => {
    const { coffers, villagers, coins, actions, buys } = resources;
    return (<div className="resources" style={{ gridArea: "resources" }}>
        <p>Coffers: {coffers}</p>
        <p>Villagers: {villagers}</p>
        <p>Coins: {coins}</p>
        <p>Actions: {actions}</p>
        <p>Buys: {buys}</p>
    </div>)
}

export const Hand = ({ hand }: { hand: CardInstance[] }): JSX.Element => {
    const dispatch = useAppDispatch();
    const columnWidth = 100;
    const cardTextWidth = columnWidth * 1.5;
    const maxNameLength = 10;//åhand.reduce((max, cardInstance) => Math.max(max, cardInstance.card.name.length), 0);
    const fontSize = cardTextWidth / maxNameLength;

    const cards = hand.map((cardInstance: CardInstance) => {
        return <Card card={cardInstance.card} fontSize={fontSize} gridArea="" key={cardInstance.id} isCompact={false} onClick={() => dispatch(playCard(cardInstance.id))} />
    });

    return (<div className={styles.hand} style={{ gridArea: "hand", "--column-width": `${columnWidth}px` } as React.CSSProperties}>
        {cards}
    </div>);
}

export const Deck = ({ deck }: { deck: CardInstance[] }): JSX.Element => {
    const columnWidth = 100;
    const cardTextWidth = columnWidth * 1.5;
    const maxNameLength = 10; //deck.reduce((max, cardInstance) => Math.max(max, cardInstance.card.name.length), 0);
    const fontSize = cardTextWidth / maxNameLength;

    const cards = deck.map((cardInstance: CardInstance) => {
        return <Card card={cardInstance.card} fontSize={fontSize} gridArea="" key={cardInstance.id} isCompact={false} />
    });

    return (<div className={styles.deck} style={{ gridArea: "deck", "--column-width": `${columnWidth}px` } as React.CSSProperties}>
        {cards}
    </div>);
}

export const Controls = (): JSX.Element => {
    const dispatch = useAppDispatch();
    return (<div className={styles.controls} style={{ gridArea: "controls" }}>
        <button onClick={() => dispatch(endTurn())}>End Turn</button>
    </div>)
}

export const Player = (): JSX.Element => {
    const hand = useAppSelector(selectHand);
    const deck = useAppSelector(selectDeck);
    const resources = useAppSelector(selectResources);
    return <div className={styles.hud}>
        <Resources resources={resources} />
        <Hand hand={hand} />
        <Controls />
    </div>
}