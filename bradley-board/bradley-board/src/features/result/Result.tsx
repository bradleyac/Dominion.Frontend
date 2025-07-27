import { JSX } from "react";
import { GameResult, selectMyPlayerId } from "../board/boardSlice";
import styles from "./Result.module.css";
import { useAppSelector } from "../../app/hooks";

export const Result = ({ result }: { result: GameResult }): JSX.Element => {
  const playerId = useAppSelector(selectMyPlayerId);
  const won = result.winners.includes(playerId);
  const tied = won && result.winners.length > 1;

  return (
    <div className={styles.result}>
      {tied ? "You tied!" : won ? "You won!" : "You lost!"}
      {Object.entries(result.scores).map(x => (
        <p>
          {x[0]}: {Math.floor(x[1])}
        </p>
      ))}
    </div>
  );
};
