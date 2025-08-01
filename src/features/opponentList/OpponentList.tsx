import { JSX } from "react";
import {
  PartialPlayerState,
  selectActivePlayer,
  selectOpponents,
} from "../board/boardSlice";
import styles from "./OpponentList.module.css";
import { useAppSelector } from "../../app/hooks";

export const OpponentList = (): JSX.Element => {
  const opponents = useAppSelector(selectOpponents);
  return (
    <div className={styles.opponentList}>
      {opponents.map(opponent => (
        <Opponent key={opponent.playerId} opponent={opponent} />
      ))}
    </div>
  );
};

export const Opponent = ({
  opponent,
}: {
  opponent: PartialPlayerState;
}): JSX.Element => {
  const activePlayer = useAppSelector(selectActivePlayer);
  return (
    <div
      className={`${styles.opponentFrame} ${activePlayer === opponent.playerId ? styles.active : ""}`}
    >
      <div className={styles.name}>{opponent.playerId}</div>
    </div>
  );
};
