import { JSX, useContext } from "react";
import {
  CardInstance,
  PlayerResources,
  selectActivePlayer,
  selectCurrentPlayer as selectCurrentPlayerId,
  selectHand,
  selectMyName,
  selectMyPlayerId,
  selectPhase,
  selectResources,
} from "../board/boardSlice";
import { Card } from "../card/Card";
import styles from "./Player.module.css";
import { useAppSelector } from "../../app/hooks";
import { DiscardPile } from "../cardPiles/Discard";
import { Deck } from "../cardPiles/Deck";
import { SignalrContext } from "../../app/signalrContext";
import { GameContext } from "../game/gameContext";

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
        cardId={cardInstance.cardId}
        cardInstanceId={cardInstance.instanceId}
        key={cardInstance.instanceId}
        isCompact={false}
        zone="Hand"
      />
    );
  });

  return <div className={styles.hand}>{cards}</div>;
};

export const Controls = (): JSX.Element => {
  const signalrConnector = useContext(SignalrContext);
  const { gameId } = useContext(GameContext);
  const phase = useAppSelector(selectPhase);
  const currentPlayerId = useAppSelector(selectCurrentPlayerId);
  const playerId = useAppSelector(selectMyPlayerId);
  const isCurrentPlayer = currentPlayerId === playerId;

  return (
    <div className={styles.controls}>
      {isCurrentPlayer && phase === "Action" && <button onClick={() => signalrConnector?.endActionPhase(gameId)}>End Action Phase</button>}
      {isCurrentPlayer && <button onClick={() => signalrConnector?.endTurn(gameId)}>End Turn</button>}
      <button onClick={(() => signalrConnector?.undo(gameId))}>Undo</button>
    </div>
  );
};

export const Player = (): JSX.Element => {
  const hand = useAppSelector(selectHand);
  const resources = useAppSelector(selectResources);
  const myName = useAppSelector(selectMyName);
  const activePlayer = useAppSelector(selectActivePlayer);
  return (
    <div className={`${styles.hud} ${activePlayer === myName ? styles.hudActive : ""}`}>
      <div className={styles.playerName}>{myName}</div>
      <Resources resources={resources} />
      <Hand hand={hand} />
      <Deck />
      <DiscardPile />
      <Controls />
    </div >
  );
};
