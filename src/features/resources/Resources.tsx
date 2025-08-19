import { JSX, useContext } from "react";
import { useAppSelector } from "../../app/hooks";
import { SignalrContext } from "../../app/signalrContext";
import { GameContext } from "../game/gameContext";
import {
  selectCurrentPlayer,
  selectMyPlayerId,
  selectPhase,
  selectResources,
} from "../game/gameSlice";
import { Deck } from "../cardPiles/Deck";
import { DiscardPile } from "../cardPiles/Discard";
import { KingdomButton } from "../kingdom/Kingdom";
import { IconButton, IconType } from "../modal/Modal";

import styles from "./Resources.module.css";
import { ReactiveCount } from "../reactiveCount/ReactiveCount";

export const Resources = () => {
  const phase = useAppSelector(selectPhase);
  const currentPlayerId = useAppSelector(selectCurrentPlayer);
  const playerId = useAppSelector(selectMyPlayerId);
  const isCurrentPlayer = currentPlayerId === playerId;
  const signalrConnector = useContext(SignalrContext);
  const { coffers, villagers, coins, actions, buys } =
    useAppSelector(selectResources);
  const { gameId } = useContext(GameContext);

  return (
    <div className={styles.resources}>
      <Deck />
      <DiscardPile />
      <IconButton
        icon="Undo"
        title="Undo"
        onClick={() => signalrConnector?.undo(gameId)}
        lit={false}
      />
      <KingdomButton />
      <ResourceIcon
        type="Actions"
        lit={phase === "Action"}
        title="End Action Phase"
        disabled={!isCurrentPlayer || phase !== "Action"}
        counts={[actions, villagers]}
        onClick={() => signalrConnector?.endActionPhase(gameId)}
      />
      <ResourceIcon
        type="Coins"
        lit={phase === "BuyOrPlay"}
        title="Play All Treasures"
        disabled={!isCurrentPlayer || !["Action", "BuyOrPlay"].includes(phase)}
        counts={[coins, coffers]}
        onClick={() => signalrConnector?.playAllTreasures(gameId)}
      />
      <ResourceIcon
        type="Buys"
        lit={phase === "Buy"}
        disabled={true}
        counts={[buys]}
      />
      <ResourceIcon
        type="Cleanup"
        lit={phase === "Cleanup"}
        title="End Turn"
        disabled={!isCurrentPlayer}
        counts={[]}
        onClick={() => signalrConnector?.endTurn(gameId)}
      />
    </div>
  );
};

const ResourceIcon = ({
  type,
  lit,
  title,
  disabled = false,
  counts = [],
  onClick = () => {},
}: {
  type: IconType;
  lit: boolean;
  title?: string;
  disabled?: boolean;
  counts?: number[];
  onClick?: () => void;
}): JSX.Element => {
  return (
    <div className={styles.resourceIcon}>
      <IconButton
        icon={type}
        lit={lit}
        title={title ?? ""}
        onClick={onClick}
        disabled={disabled}
      />
      <div className={styles.resourceCounts}>
        {counts.map((count, index) => (
          <ReactiveCount key={index} count={count} />
        ))}
      </div>
    </div>
  );
};
