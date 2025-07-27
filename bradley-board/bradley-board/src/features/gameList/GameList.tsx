import { JSX, useEffect, useRef, useState } from "react"
import getSignalrInstance from "../../app/signalrConnector";
import { Game } from "../game/Game";
import { SignalrContext } from "../../app/signalrContext";
import styles from "./GameList.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuthStatus, selectUserId, userLoggedIn } from "../auth/authSlice";

export const GameList = (): JSX.Element => {
  const connector = useRef(getSignalrInstance());
  const [games, setGames] = useState<string[]>([]);
  const [gameId, setGameId] = useState<string | undefined>(undefined);
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(state => selectAuthStatus(state.auth));
  const userId = useAppSelector(state => selectUserId(state.auth));

  useEffect(() => {
    return connector.current.gameListEvents({
      onGameCreated: (gameId: string) => { setGames(games => [...games, gameId]) }
    });
  }, [])
  useEffect(() => {
    if (authStatus === "pending") {
      fetch("/.auth/me").then(response => response.json().then(json => dispatch(userLoggedIn(json.clientPrincipal.userDetails))));
    }
  }, [authStatus]);

  if (authStatus === "pending" || authStatus === "unauthenticated") {
    return <p>"Login required."</p>;
  }

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
      <p>Hi {userId}!</p>
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