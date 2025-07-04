import { JSX } from "react";
import {
  CardInstance,
  endActionPhase,
  endTurn,
  PlayerResources,
  selectHand,
  selectResources,
} from "../board/boardSlice";
import { Card } from "../card/Card";
import styles from "./Player.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { DiscardPile } from "../cardPiles/Discard";
import { Deck } from "../cardPiles/Deck";

export const Resources = ({
  resources,
}: {
  resources: PlayerResources;
}): JSX.Element => {
  const { coffers, villagers, coins, actions, buys } = resources;
  return (
    <div className="resources" style={{ gridArea: "resources" }}>
      <p>Coffers: {coffers}</p>
      <p>Villagers: {villagers}</p>
      <p>Coins: {coins}</p>
      <p>Actions: {actions}</p>
      <p>Buys: {buys}</p>
    </div>
  );
};

export const Hand = ({ hand }: { hand: CardInstance[] }): JSX.Element => {
  const cards = hand.map((cardInstance: CardInstance) => {
    return (
      <Card
        card={cardInstance}
        key={cardInstance.id}
        isCompact={false}
        zone="hand"
      />
    );
  });

  return <div className={styles.hand}>{cards}</div>;
};

export const Controls = (): JSX.Element => {
  const dispatch = useAppDispatch();
  return (
    <div className={styles.controls}>
      <button onClick={() => dispatch(endActionPhase())}>End Action Phase</button>
      <button onClick={() => dispatch(endTurn())}>End Turn</button>
    </div>
  );
};

export const Player = (): JSX.Element => {
  const hand = useAppSelector(selectHand);
  const resources = useAppSelector(selectResources);
  return (
    <div className={styles.hud}>
      <Resources resources={resources} />
      <Hand hand={hand} />
      <Deck />
      <DiscardPile />
      <Controls />
    </div>
  );
};
