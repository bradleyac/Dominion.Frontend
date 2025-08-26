import { Fragment, JSX, useContext, useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { SignalrContext } from "../../app/signalrContext";
import { GameContext } from "../game/gameContext";
import { Phase, selectCurrentPlayer, selectMyPlayerId, selectPhase, selectResources } from "../game/gameSlice";
import { IconButton, IconType } from "../modal/Modal";

import styles from "./Resources.module.css";
import { ReactiveCount } from "../reactiveCount/ReactiveCount";

const phases = {
  "Action": 0,
  "BuyOrPlay": 1,
  "Buy": 2,
  "Cleanup": 3,
} as Record<Phase, number>

const reversePhases = [
  "Action",
  "BuyOrPlay",
  "Buy",
  "Cleanup"
] as Phase[]

const animationDuration = 200;

export const Resources = () => {
  const phase = useAppSelector(selectPhase);
  const [litPhase, setLitPhase] = useState(phase);
  const currentPlayerId = useAppSelector(selectCurrentPlayer);
  const [lastPhase, setLastPhase] = useState(phase);
  const [lastCurrentPlayer, setLastCurrentPlayer] = useState(currentPlayerId);
  const playerId = useAppSelector(selectMyPlayerId);
  const isCurrentPlayer = currentPlayerId === playerId;
  const signalrConnector = useContext(SignalrContext);
  const { coffers, villagers, coins, actions, buys } = useAppSelector(selectResources);
  const { gameId } = useContext(GameContext);
  const autoLight = phase === lastPhase && currentPlayerId === lastCurrentPlayer;

  const animatePhase = (phase: Phase) => {
    setLitPhase(phase);
  }

  useEffect(() => {
    if (currentPlayerId === lastCurrentPlayer) {
      const oldPhaseIndex = phases[lastPhase]
      const newPhaseIndex = phases[phase];
      const skippedPhases = reversePhases.slice(oldPhaseIndex + 1, newPhaseIndex + 1);
      const animations = [...skippedPhases.map((phase, i) => () => setTimeout(() => animatePhase(phase), i * animationDuration)), () => setTimeout(() => setLastPhase(phase), skippedPhases.length * animationDuration)];
      for (const animation of animations) {
        animation();
      }
    }
    else {
      const oldPhaseIndex = phases[lastPhase]
      const newPhaseIndex = phases[phase];
      const skippedPhases = [...reversePhases.slice(oldPhaseIndex + 1), ...reversePhases.slice(0, newPhaseIndex + 1)];
      console.log(skippedPhases);
      const animations = [...skippedPhases.map((phase, i) => () => setTimeout(() => animatePhase(phase), i * animationDuration)), () => setTimeout(() => { setLastPhase(phase); setLastCurrentPlayer(currentPlayerId); }, skippedPhases.length * animationDuration)];
      for (const animation of animations) {
        animation();
      }
    }
  }, [autoLight])

  return (
    <div className={styles.resources}>
      <ResourceIcon type="Actions" lit={autoLight ? phase === "Action" : litPhase === "Action"} title="End Action Phase" disabled={!isCurrentPlayer || phase !== "Action"} counts={[actions, villagers]} onClick={() => signalrConnector?.endActionPhase(gameId)} />
      <ResourceIcon type="Coins" lit={autoLight ? phase === "BuyOrPlay" : litPhase === "BuyOrPlay"} title="Play All Treasures" disabled={!isCurrentPlayer || !["Action", "BuyOrPlay"].includes(phase)} counts={[coins, coffers]} onClick={() => signalrConnector?.playAllTreasures(gameId)} />
      <ResourceIcon type="Buys" lit={autoLight ? phase === "Buy" : litPhase === "Buy"} disabled={true} counts={[buys]} />
      <ResourceIcon type="Cleanup" lit={autoLight ? phase === "Cleanup" : litPhase === "Cleanup"} title="End Turn" disabled={!isCurrentPlayer} counts={[]} onClick={() => signalrConnector?.endTurn(gameId)} />
    </div>
  )
};

const ResourceIcon = ({ type, lit, title, disabled = false, counts = [], onClick = () => { } }: { type: IconType, lit: boolean, title?: string, disabled?: boolean, counts?: number[], onClick?: () => void }): JSX.Element => {
  return (
    <div className={styles.resource}>
      <div className={styles.resourceCounts}>
        {counts.map((count, index) => (
          <ReactiveCount key={index} count={count} />
        ))}
      </div>
      <IconButton icon={type} lit={lit} title={title ?? ""} onClick={onClick} disabled={disabled} />
    </div>
  );
}