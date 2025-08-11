import { JSX, useContext, useEffect } from "react";
import { Board } from "../board/Board";
import { HistoryButton } from "../history/History";
import { PlayArea } from "../playArea/PlayArea";
import { Player } from "../player/Player";
import { SignalrContext } from "../../app/signalrContext";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectGameId, selectGameResult, updateState } from "./gameSlice";
import { GameContext } from "./gameContext";
import { PrivateReveal, Reveal } from "../reveal/Reveal";
import { Choice } from "../choice/Choice";
import { Categorize } from "../choice/Categorize";
import { Arrange } from "../choice/Arrange";
import { Result } from "../result/Result";
import { React } from "../choice/React";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { GameInfoButton } from "../gameInfo/GameInfo";

import styles from "./Game.module.css";
import { KingdomButton } from "../kingdom/Kingdom";
import { IconButton } from "../modal/Modal";
import { isTouchDevice } from "../../app/utils";

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
  const gameResult = useAppSelector(selectGameResult);
  const loadedGameId = useAppSelector(selectGameId);

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
          {/* <Status hasNextGame={hasNextGame} nextGame={nextGame} /> */}
          <Board />
          <div className={styles.buttons}>
            <GameInfoButton />
            <KingdomButton />
            <HistoryButton />
            <IconButton icon="Leave" title="Leave Game" onClick={() => leaveGame()} lit={false} />
          </div>
          <PlayArea />
          <Reveal />
          <PrivateReveal />
          <Categorize />
          <Arrange />
          <React />
          <Choice />
          <Player />
          {gameResult && (
            <div className={styles.overlay}>
              <div className={styles.result}>
                <Result result={gameResult} />
                <button onClick={leaveGame}>Leave Game</button>
                {hasNextGame && <button onClick={nextGame}>Next Game</button>}
              </div>
            </div>
          )}
        </GameContext>
      </DndProvider>
    </div>
  );
};

const Loading = () => {
  return (
    <div className={styles.loading}>
      <p>Loading Game...</p>
    </div>
  );
};
