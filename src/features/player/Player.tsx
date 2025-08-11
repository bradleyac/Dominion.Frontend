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
  selectSelectedCards,
} from "../game/gameSlice";
import { Card } from "../card/Card";
import styles from "./Player.module.css";
import { useAppSelector } from "../../app/hooks";
import { DiscardPile } from "../cardPiles/Discard";
import { Deck } from "../cardPiles/Deck";
import { SignalrContext } from "../../app/signalrContext";
import { GameContext } from "../game/gameContext";
import { selectPlayerId } from "../auth/authSlice";
import { IconButton, IconType } from "../modal/Modal";

export const Resources = ({
  resources,
}: {
  resources: PlayerResources;
}): JSX.Element => {
  const phase = useAppSelector(selectPhase);
  const currentPlayerId = useAppSelector(selectCurrentPlayerId);
  const playerId = useAppSelector(selectMyPlayerId);
  const isCurrentPlayer = currentPlayerId === playerId;
  const signalrConnector = useContext(SignalrContext);
  const { gameId } = useContext(GameContext);
  const { coffers, villagers, coins, actions, buys } = resources;
  return (
    <div className={`${styles.resources} ${isCurrentPlayer && styles.active}`}>
      <ResourceIcon type="Actions" lit={phase === "Action"} disabled={true} counts={[actions, villagers]} />
      <ResourceIcon type="Coins" lit={phase === "BuyOrPlay"} disabled={!isCurrentPlayer || phase !== "Action"} counts={[coins, coffers]} onClick={() => signalrConnector?.endActionPhase(gameId)} />
      <ResourceIcon type="Buys" lit={phase === "Buy"} disabled={true} counts={[buys]} />
      <ResourceIcon type="Cleanup" lit={phase === "Cleanup"} disabled={!isCurrentPlayer} counts={[]} onClick={() => signalrConnector?.endTurn(gameId)} />
      <Deck />
      <DiscardPile />
      <IconButton icon="Undo" title="Undo" onClick={() => signalrConnector?.undo(gameId)} lit={false} />
    </div>
  )
};

const ResourceIcon = ({ type, lit, disabled = false, counts = [], onClick = () => { } }: { type: IconType, lit: boolean, disabled?: boolean, counts?: number[], onClick?: () => void }): JSX.Element => {
  return (
    <div className={styles.resourceIcon}>
      <IconButton icon={type} lit={lit} title="End Action Phase" onClick={onClick} disabled={disabled} />
      <div className={styles.resourceCounts}>
        {counts.map((count, index) => (
          <span key={index} className={styles.resourceCount}>{count}</span>
        ))}
      </div>
    </div>
  );
}

export const Hand = ({ hand }: { hand: CardInstance[] }): JSX.Element => {
  const selectedCards = useAppSelector(selectSelectedCards);
  const groupedCards = hand.reduce((groups: { [key: number]: { unselected: CardInstance[], selected: CardInstance[] } }, card) => {
    if (!groups[card.cardId]) {
      groups[card.cardId] = { unselected: [], selected: [] };
    }
    if (selectedCards.includes(card.instanceId)) {
      groups[card.cardId].selected.push(card);
    } else {
      groups[card.cardId].unselected.push(card);
    }
    return groups;
  }, {});

  const expandedGroups = Object.values(groupedCards).flatMap((group) => [group.unselected, group.selected]).filter(cards => cards.length > 0);

  const cards = expandedGroups.map(cards => {
    console.log(cards);
    const topCard = cards[0];
    return (
      <Card
        cardId={topCard.cardId}
        cardInstanceId={topCard.instanceId}
        key={topCard.instanceId}
        isCompact={false}
        zone="Hand"
        count={cards.length}
      />
    );
  });

  return <div className={styles.hand}>{cards}</div>;
};

export const Player = (): JSX.Element => {
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
    </div>
  );
};
