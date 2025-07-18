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

export const Game = ({ gameId, playerId, leaveGame }: { gameId: string, playerId: string, leaveGame: () => void }): JSX.Element => {
  const dispatch = useAppDispatch();
  const connector = useContext(SignalrContext);
  const gameResult = useAppSelector(selectGameResult);

  useEffect(() => {
    connector?.retrieveGameState(gameId, playerId)
      .then(state => { if (state) { dispatch(updateState(state)); } });
  }, [gameId, playerId])
  useEffect(() => {
    return connector?.gameEvents({
      onStateUpdated: (newState: any) => { dispatch(updateState(newState)) },
    });
  }, [])

  return <div className={styles.game}>
    <GameContext value={{ gameId, playerId }}>
      <Status />
      <Board />
      <Log />
      <OpponentList />
      <PlayArea />
      <Reveal />
      <PrivateReveal />
      <Categorize />
      <Arrange />
      <Choice />
      <Player />
      {gameResult && <div className={styles.overlay}>
        <div className={styles.result}>
          <Result playerId={playerId} result={gameResult} />
          <button onClick={leaveGame}>Leave Game</button>
        </div>
      </div>}
    </GameContext>
  </div >
}