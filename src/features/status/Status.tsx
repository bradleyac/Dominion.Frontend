import { JSX } from "react";
import styles from "./Status.module.css";
import {
  selectActivePlayer,
  selectCurrentPlayer,
  selectGameId,
  selectMyPlayerId,
  selectPhase,
  selectTurn,
} from "../game/gameSlice";
import { useAppSelector } from "../../app/hooks";
import { KingdomButton } from "../kingdom/Kingdom";

export const Status = ({
  nextGame,
  hasNextGame,
}: {
  nextGame: () => void;
  hasNextGame: boolean;
}): JSX.Element => {
  const gameId = useAppSelector(selectGameId);
  const turn = useAppSelector(selectTurn);
  const currentPlayerName = useAppSelector(selectCurrentPlayer);
  const currentPhase = useAppSelector(selectPhase);
  const activePlayerId = useAppSelector(selectActivePlayer);
  const myPlayerId = useAppSelector(selectMyPlayerId);

  return (
    <div className={styles.status}>
      {hasNextGame && (
        <button
          className={`${styles.nextGame} ${myPlayerId !== activePlayerId && styles.lit}`}
          onClick={(_) => nextGame()}
        >
          Next Game
        </button>
      )}
      <div className={styles.gameId}>{gameId}</div>
      <div className={styles.turn}>{turn}</div>
      <div className={styles.player}>{currentPlayerName}</div>
      <div className={styles.phase}>{currentPhase}</div>
      <div className={styles.kingdom}>
        <KingdomButton />
      </div>
    </div>
  );
};
