import { JSX } from "react";
import { GameResult } from "../board/boardSlice";
import styles from "./Result.module.css";



export const Result = ({ playerId, result }: { playerId: string, result: GameResult }): JSX.Element => {
  const won = result.winners.includes(playerId);
  const tied = won && result.winners.length > 1;

  return <div className={styles.result}>
    {tied ? "You tied!" : won ? "You won!" : "You lost!"}
    {Object.entries(result.scores).map(x => <p>{x[0]}: {x[1]}</p>)}
  </div>
}