import { JSX } from "react"
import { CardInstance, endTurn, playCard, PlayerResources, selectDeck, selectDiscard, selectHand, selectResources } from "../board/boardSlice"
import { Card, Deck, DiscardPile } from "../card/Card"
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
    const cards = hand.map((cardInstance: CardInstance) => {
        return <Card card={cardInstance.card} key={cardInstance.id} isCompact={false} onClick={() => dispatch(playCard(cardInstance.id))} />
    });

    return (<div className={styles.hand}>
        {cards}
    </div>);
}

export const Controls = (): JSX.Element => {
    const dispatch = useAppDispatch();
    return (<div className={styles.controls}>
        <button onClick={() => dispatch(endTurn())}>End Turn</button>
    </div>)
}

export const Player = (): JSX.Element => {
    const hand = useAppSelector(selectHand);
    const deck = useAppSelector(selectDeck);
    const discard = useAppSelector(selectDiscard);
    const resources = useAppSelector(selectResources);
    return <div className={styles.hud}>
        <Resources resources={resources} />
        <Hand hand={hand} />
        <Deck deck={deck} />
        <DiscardPile discard={discard} />
        <Controls />
    </div>
}