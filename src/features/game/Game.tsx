import { JSX, useContext, useEffect } from "react";
import { Board } from "../board/Board";
import { HistoryButton } from "../history/History";
import { SignalrContext } from "../../app/signalrContext";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectGameId, updateState } from "./gameSlice";
import { GameContext } from "./gameContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { GameInfoButton } from "../gameInfo/GameInfo";

import styles from "./Game.module.css";
import { IconButton } from "../modal/Modal";
import { isTouchDevice } from "../../app/utils";
import { Tray } from "../tray/Tray";
import { GameControls } from "../gameControls/GameControls";
import { NotBoard } from "../notBoard/NotBoard";

export const Game = ({
  gameId,
  leaveGame,
  nextGame,
  hasNextGame,
}: {
  gameId: string;
  leaveGame: () => Promise<void>;
  nextGame: () => void;
  hasNextGame: boolean;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const connector = useContext(SignalrContext);
  const loadedGameId = useAppSelector(selectGameId);

  useEffect(() => {
    const root = document.getElementById("root");
    if (root && root.requestFullscreen) {
      root?.requestFullscreen();
    }
  }, [gameId])

  useEffect(() => {
    connector?.retrieveGameState(gameId).then((state) => {
      if (state) {
        dispatch(updateState(state));
      }
    });
  }, [gameId]);

  if (!loadedGameId) {
    return <Loading />;
  }

  const backendForDnd = isTouchDevice() ? TouchBackend : HTML5Backend;

  return (
    <div className={styles.game}>
      <DndProvider backend={backendForDnd}>
        <GameContext value={{ gameId }}>

          <div className={styles.board}>
            <Board />
          </div>

          <div className={styles.notBoard}>
            <NotBoard leaveGame={leaveGame} />
          </div>

          <div className={styles.tray}>
            <GameControls hasNextGame={hasNextGame} nextGame={nextGame} />
            <Tray leaveGame={leaveGame} />
          </div>

        </GameContext>
      </DndProvider>
    </div >
  );
};

const Loading = () => {
  return (
    <div className={styles.loading}>
      <p>Loading Game...</p>
    </div>
  );
};
