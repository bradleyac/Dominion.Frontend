import { JSX, useContext, useEffect } from "react";
import styles from "./Game.module.css";
import { Status } from "../status/Status";
import { Board } from "../board/Board";
import { Log } from "../log/Log";
import { PlayArea } from "../playArea/PlayArea";
import { Player } from "../player/Player";
import { SignalrContext } from "../../app/signalrContext";
import { useAppDispatch } from "../../app/hooks";
import { updateState } from "../board/boardSlice";
import { GameContext } from "./gameContext";
import { OpponentList } from "../opponentList/OpponentList";
import { Reveal } from "../reveal/Reveal";
import { Choice } from "../choice/Choice";

export const Game = ({ gameId, playerId }: { gameId: string, playerId: string }): JSX.Element => {
  const dispatch = useAppDispatch();
  const connector = useContext(SignalrContext);
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
      <Choice />
      <Player />
    </GameContext>
  </div >
}