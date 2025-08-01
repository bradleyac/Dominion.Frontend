import { JSX, useEffect, useRef, useState } from "react";
import getSignalrInstance from "../../app/signalrConnector";
import { Game } from "../game/Game";
import { SignalrContext } from "../../app/signalrContext";
import styles from "./GameList.module.css";
import { useAppSelector } from "../../app/hooks";
import { selectIdToken, selectName, selectPlayerId } from "../auth/authSlice";

export type Game = {
  gameId: string,
  players: string[]
}

export const GameList = (): JSX.Element => {
  const idToken = useAppSelector(state => selectIdToken(state.auth));
  const connector = useRef(getSignalrInstance(idToken!));
  const [games, setGames] = useState<Game[]>([]);
  const [gameId, setGameId] = useState<string | undefined>(undefined);
  const userName = useAppSelector(state => selectName(state.auth));
  const playerId = useAppSelector(state => selectPlayerId(state.auth));

  useEffect(() => {
    return connector.current.gameListEvents({
      onGameCreated: (game: Game) => {
        setGames(games => [...games, game]);
      }
    });
  }, []);

  // TODO: Hacky, this should detect when it's connected instead of waiting.
  useEffect(() => {
    setTimeout(() => connector.current.listGames().then(games => setGames(games)), 100)
  }, []);

  async function clearGame() {
    setGameId(undefined);
    const newGames = await connector.current.listGames();
    setGames(newGames);
  }

  async function joinGame(gameId: string): Promise<void> {
    const joined = await connector.current.joinGame(gameId);
    if (joined) {
      setGameId(gameId);
      console.log(gameId);
    }
  }

  async function abandonGame(gameId: string): Promise<void> {
    await connector.current.abandonGame(gameId);
    await clearGame();
  }

  return gameId ? (
    <SignalrContext value={connector.current}>
      <Game gameId={gameId} leaveGame={clearGame} />
    </SignalrContext>
  ) : (
    <div className={styles.gameList}>
      <p>Hi {userName}!</p>
      <button
        onClick={async () => {
          const newGames = await connector.current.listGames();
          console.log(newGames);
          setGames(newGames);
        }}
      >
        Refresh List
      </button>
      <button
        onClick={async () => {
          const { gameId } = await connector.current.createGame();
          setGameId(gameId);
          console.log({ gameId });
        }}
      >
        Create Game
      </button>
      Games:
      <div className={styles.listings}>
        {games.map(game => (
          <GameListing
            game={game}
            key={game.gameId}
            inGame={game.players.includes(playerId ?? "")}
            joinGame={() => game.players.includes(playerId ?? "") ? setGameId(game.gameId) : joinGame(game.gameId)}
            abandonGame={() => abandonGame(game.gameId)} />
        ))}
      </div>
    </div>
  );
};

const GameListing = ({ game, inGame, joinGame, abandonGame }: { game: Game, inGame: boolean, joinGame: () => void, abandonGame: () => void }): JSX.Element => {
  return <div className={styles.gameListing}>
    {game.players.map((player, index) => <p key={player}>Player {index + 1}: {player}</p>)}
    {game.gameId}
    {inGame
      ? <>
        <button onClick={joinGame}>Enter Game</button>
        <button onClick={abandonGame}>Abandon Game</button>
      </>
      : <button onClick={joinGame}>Join Game</button>
    }
  </div>
}
