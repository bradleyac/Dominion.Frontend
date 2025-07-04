import { JSX, useContext, useEffect, useRef } from "react";
import styles from "./Game.module.css";
import { Status } from "../status/Status";
import { Board } from "../board/Board";
import { Log } from "../log/Log";
import { PlayArea } from "../playArea/PlayArea";
import { Player } from "../player/Player";
import getInstance from "../../app/signalrConnection";
import { SignalrContext } from "../../app/signalrContext";
import { useAppDispatch } from "../../app/hooks";
import { updateState } from "../board/boardSlice";

export const Game = ({ gameId, playerId }: { gameId: string, playerId: string }): JSX.Element => {
  const dispatch = useAppDispatch();
  const connector = useContext(SignalrContext);
  useEffect(() => {
    connector?.retrieveGameState(gameId, playerId).then(state => dispatch(updateState(state)));
  }, [gameId, playerId])
  useEffect(() => {
    return connector?.gameEvents({
      onStateUpdated: (newState: any) => { console.log(newState); dispatch(updateState(newState)) },
    });
  }, [])
  return <div className={styles.game}>
    <Status />
    <Board />
    <Log />
    <PlayArea />
    <Player />
  </div >
}