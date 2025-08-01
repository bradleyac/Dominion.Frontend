import { JSX } from "react";
import styles from "./Status.module.css";
import {
  selectCurrentPlayer,
  selectGameId,
  selectPhase,
  selectTurn,
} from "../board/boardSlice";
import { useAppSelector } from "../../app/hooks";

export const Status = (): JSX.Element => {
  const gameId = useAppSelector(selectGameId);
  const turn = useAppSelector(selectTurn);
  const currentPlayerName = useAppSelector(selectCurrentPlayer);
  const currentPhase = useAppSelector(selectPhase);

  return (
    <div className={styles.status}>
      <div className={styles.gameId}>{gameId}</div>
      <div className={styles.turn}>{turn}</div>
      <div className={styles.player}>{currentPlayerName}</div>
      <div className={styles.phase}>{currentPhase}</div>
    </div>
  );
};
