import { JSX, useContext, useEffect } from "react";
import styles from "./Game.module.css";
import { Status } from "../status/Status";
import { Board } from "../board/Board";
import { Log } from "../log/Log";
import { PlayArea } from "../playArea/PlayArea";
import { Player } from "../player/Player";
import { SignalrContext } from "../../app/signalrContext";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectGameResult, updateState } from "../board/boardSlice";
import { GameContext } from "./gameContext";
import { OpponentList } from "../opponentList/OpponentList";
import { PrivateReveal, Reveal } from "../reveal/Reveal";
import { Choice } from "../choice/Choice";
import { Categorize } from "../choice/Categorize";
import { Arrange } from "../choice/Arrange";
import { Result } from "../result/Result";
import { React } from "../choice/React";

export const Game = ({ gameId, leaveGame }: { gameId: string, leaveGame: () => void }): JSX.Element => {
  const dispatch = useAppDispatch();
  const connector = useContext(SignalrContext);
  const gameResult = useAppSelector(selectGameResult);

  useEffect(() => {
    connector?.retrieveGameState(gameId)
      .then(state => { if (state) { dispatch(updateState(state)); } });
  }, [gameId])
  useEffect(() => {
    return connector?.gameEvents({
      onStateUpdated: (newState: any) => { dispatch(updateState(newState)) },
    });
  }, [])

  return <div className={styles.game}>
    <GameContext value={{ gameId }}>
      <Status />
      <Board />
      <Log />
      <OpponentList />
      <PlayArea />
      <Reveal />
      <PrivateReveal />
      <Categorize />
      <Arrange />
      <React />
      <Choice />
      <Player />
      {gameResult && <div className={styles.overlay}>
        <div className={styles.result}>
          <Result result={gameResult} />
          <button onClick={leaveGame}>Leave Game</button>
        </div>
      </div>}
    </GameContext>
  </div >
}