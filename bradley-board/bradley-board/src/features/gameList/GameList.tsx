import { JSX, useEffect, useRef, useState } from "react"
import getSignalrInstance from "../../app/signalrConnector";
import { Game } from "../game/Game";
import { SignalrContext } from "../../app/signalrContext";
import styles from "./GameList.module.css";

export const GameList = (): JSX.Element => {
  const connector = useRef(getSignalrInstance());
  const [games, setGames] = useState<string[]>([]);
  const [gameId, setGameId] = useState<string | undefined>(undefined);
  useEffect(() => {
    return connector.current.gameListEvents({
      onGameCreated: (gameId: string) => { setGames(games => [...games, gameId]) }
    });
  }, [])
  useEffect(() => {
    fetch("/.auth/me").then(response => console.log(response.json()));
  });

  async function clearGame() {
    setGameId(undefined);
    const newGames = await connector.current.listGames();
    setGames(newGames);
  }

  return gameId
    ? <SignalrContext value={connector.current}>
      <Game gameId={gameId} leaveGame={clearGame} />
    </SignalrContext>
    : <div className={styles.gameList}>
      <button onClick={async () => {
        const newGames = await connector.current.listGames();
        console.log(newGames);
        setGames(newGames);
      }}>Refresh List</button>
      <button onClick={async () => {
        const { gameId } = await connector.current.createGame();
        setGameId(gameId);
        console.log({ gameId });
      }}>Create Game</button>
      Games:
      {games.length > 0 && games.map(gameId => <div key={gameId}>{gameId}
        <button onClick={async () => {
          await connector.current.joinGame(gameId);
          setGameId(gameId);
          console.log({ gameId });
        }}>Join Game</button>
      </div>)}
    </div>
}