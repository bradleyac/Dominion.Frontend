import { JSX } from "react";
import styles from "./GameControls.module.css";
import { selectActivePlayer, selectMyPlayerId } from "../game/gameSlice";
import { useAppSelector } from "../../app/hooks";
import { IconButton } from "../modal/Modal";

export const GameControls = ({
  nextGame,
  hasNextGame,
}: {
  nextGame: () => void;
  hasNextGame: boolean;
}): JSX.Element => {
  const activePlayerId = useAppSelector(selectActivePlayer);
  const myPlayerId = useAppSelector(selectMyPlayerId);

  return (
    <div className={styles.gameControls}>
      {hasNextGame && (
        <IconButton
          icon="Triangle"
          title="Next Game"
          lit={myPlayerId !== activePlayerId}
          onClick={() => nextGame()}
        />
      )}
    </div>
  );
};
