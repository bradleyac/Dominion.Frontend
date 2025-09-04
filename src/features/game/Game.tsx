import { JSX, useContext, useEffect } from "react";
import { Board } from "../board/Board";
import { SignalrContext } from "../../app/signalrContext";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectActive, selectActiveChoice, selectGameId, selectGameResult, updateState } from "./gameSlice";
import { GameContext } from "./gameContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import styles from "./Game.module.css";
import { isTouchDevice } from "../../app/utils";
import { Tray } from "../tray/Tray";
import { GameControls } from "../gameControls/GameControls";
import { Player } from "../player/Player";
import { Choice } from "../choice/Choice";
import { PlayArea } from "../playArea/PlayArea";
import { PrivateReveal, Reveal } from "../reveal/Reveal";
import { Categorize } from "../choice/Categorize";
import { Arrange } from "../choice/Arrange";
import { React } from "../choice/React";
import { Resources } from "../resources/Resources";
import { Result } from "../result/Result";
import { PersistentModal } from "../modal/Modal";

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
  const gameResult = useAppSelector(selectGameResult);
  const activeChoice = useAppSelector(selectActiveChoice);
  const active = useAppSelector(selectActive);
  // const activePlayerId = useAppSelector(selectActivePlayer);
  // const currentPlayerId = useAppSelector(selectCurrentPlayer);

  useEffect(() => {
    const root = document.getElementById("root");
    if (root && root.requestFullscreen) {
      root?.requestFullscreen().catch(console.log);
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
    <div className={`${styles.game} ${active && styles.gameActive}`}>
      <DndProvider backend={backendForDnd}>
        <GameContext value={{ gameId }}>

          <div className={styles.board}>
            <Board />
          </div>


          <div className={styles.tray}>
            <Tray leaveGame={leaveGame} />
          </div>

          <div className={styles.playArea}>
            <PlayArea />
          </div>

          <div className={styles.resources}>
            <Resources />
          </div>

          <div className={styles.player}>
            <Player />
          </div>

          {activeChoice && <PersistentModal key={activeChoice.id}>
            <div className={styles.choices}>
              <div className={styles.choicesTop}>
                <Reveal />
                <PrivateReveal />
                <Arrange />
                <Categorize />
                <React />
              </div>
              <div className={styles.choicesBottom}>
                <Choice />
              </div>
            </div>
          </PersistentModal>}

          <div className={styles.gameControls}>
            {hasNextGame && <GameControls hasNextGame={hasNextGame} nextGame={nextGame} />}
          </div>

          {
            gameResult && (
              <div className={styles.overlay}>
                <div className={styles.result}>
                  <Result result={gameResult} />
                  <button onClick={leaveGame}>Leave Game</button>
                </div>
              </div>
            )
          }
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
