import { JSX } from "react";
import styles from "./Status.module.css";
import {
  selectActivePlayer,
  selectMyPlayerId,
} from "../game/gameSlice";
import { useAppSelector } from "../../app/hooks";

export const Status = ({
  nextGame,
  hasNextGame,
}: {
  nextGame: () => void;
  hasNextGame: boolean;
}): JSX.Element => {
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
    </div>
  );
};
