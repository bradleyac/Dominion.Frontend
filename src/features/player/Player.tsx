import { JSX, useContext } from "react";
import {
  CardInstance,
  PlayerResources,
  selectActivePlayer,
  selectCurrentPlayer as selectCurrentPlayerId,
  selectHand,
  selectMyPlayerId,
  selectPhase,
  selectResources,
} from "../game/gameSlice";
import { Card } from "../card/Card";
import styles from "./Player.module.css";
import { useAppSelector } from "../../app/hooks";
import { DiscardPile } from "../cardPiles/Discard";
import { Deck } from "../cardPiles/Deck";
import { SignalrContext } from "../../app/signalrContext";
import { GameContext } from "../game/gameContext";
import { selectPlayerId } from "../auth/authSlice";

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

export const Controls = ({
  leaveGame,
}: {
  leaveGame: () => void | Promise<void>;
}): JSX.Element => {
  const signalrConnector = useContext(SignalrContext);
  const { gameId } = useContext(GameContext);
  const phase = useAppSelector(selectPhase);
  const currentPlayerId = useAppSelector(selectCurrentPlayerId);
  const playerId = useAppSelector(selectMyPlayerId);
  const isCurrentPlayer = currentPlayerId === playerId;

  return (
    <div className={styles.controls}>
      <button disabled={!isCurrentPlayer || phase !== "Action"} className={styles.endActionPhase} onClick={() => signalrConnector?.endActionPhase(gameId)}>
        End Phase
      </button>
      <button disabled={!isCurrentPlayer} className={styles.endTurn} onClick={() => signalrConnector?.endTurn(gameId)}>
        End Turn
      </button>
      <button className={styles.undo} onClick={() => signalrConnector?.undo(gameId)}>Undo</button>
      <button className={styles.return} onClick={() => leaveGame()}>Back to List</button>
    </div>
  );
};

export const Player = ({
  leaveGame,
}: {
  leaveGame: () => void | Promise<void>;
}): JSX.Element => {
  const hand = useAppSelector(selectHand);
  const resources = useAppSelector(selectResources);
  const myName = useAppSelector(selectPlayerId);
  const activePlayer = useAppSelector(selectActivePlayer);
  return (
    <div
      className={`${styles.hud} ${activePlayer === myName ? styles.hudActive : ""}`}
    >
      <div className={styles.playerName}>{myName}</div>
      <Resources resources={resources} />
      <Hand hand={hand} />
      <div className={styles.deck}><Deck /></div>
      <div className={styles.discard}><DiscardPile /></div>

      <Controls leaveGame={leaveGame} />
    </div>
  );
};
