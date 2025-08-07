import { JSX, useEffect, useState } from "react";
import { Game } from "../game/Game";
import { SignalrContext } from "../../app/signalrContext";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectIsAuthenticated,
  selectName,
  selectPlayerId,
} from "../auth/authSlice";
import { useNavigate } from "react-router";
import { useSignalr } from "../../app/useSignalr";
import { clearGame, updateState } from "../game/gameSlice";
import styles from "./GameList.module.css";

export type Game = {
  activePlayerId?: string;
  gameId: string;
  players: string[];
};

export const GameList = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { ready, signalr } = useSignalr();
  const [games, setGames] = useState<Game[]>([]);
  const [gameId, setGameId] = useState<string | undefined>(undefined);
  const userName = useAppSelector((state) => selectName(state.auth));
  const playerId = useAppSelector((state) => selectPlayerId(state.auth));
  const authenticated = useAppSelector((state) =>
    selectIsAuthenticated(state.auth),
  );

  const myGames = [
    ...games.filter((game) => game.players.includes(playerId ?? "")),
  ];
  const joinableGames = [
    ...games.filter((game) => !game.players.includes(playerId ?? "")),
  ];

  useEffect(() => {
    if (!authenticated) {
      navigate("/");
    }
  }, [authenticated]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    return signalr.current!.gameListEvents({
      onGameCreated: (game: Game) => {
        setGames((games) => [...games, game]);
      },
      onGameEnded: (gameId: string) => {
        setGames((games) => [
          ...games.filter((game) => game.gameId !== gameId),
        ]);
      },
      onGameUpdated: (game: Game) => {
        setGames((games) => [
          ...games.map((g) => (g.gameId === game.gameId ? game : g)),
        ]);
      },
    });
  }, [ready]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    return signalr.current!.gameEvents({
      onStateUpdated: (newState: any) => {
        dispatch(updateState(newState));
      },
    });
  }, [ready]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    signalr.current?.listGames().then((games) => setGames(games));
  }, [ready]);

  async function clearCurrentGame() {
    dispatch(clearGame());
    setGameId(undefined);

    if (ready) {
      setGames(await signalr.current!.listGames());
    }
  }

  async function joinGame(gameId: string): Promise<void> {
    if (!ready) {
      return;
    }

    const joined = await signalr.current!.joinGame(gameId);
    if (joined) {
      setGameId(gameId);
      console.log(gameId);
    }
  }

  async function abandonGame(gameId: string): Promise<void> {
    if (!ready) {
      return;
    }

    await signalr.current!.abandonGame(gameId);
    await clearCurrentGame();
  }

  function nextGame() {
    const activeGames = myGames.filter(
      (g) => g.gameId !== gameId && g.activePlayerId === playerId,
    );
    if (activeGames.length > 0) {
      dispatch(clearGame());
      setGameId(activeGames[0].gameId);
    }
  }

  const hasNextGame =
    !!gameId &&
    myGames.filter((g) => g.gameId !== gameId && g.activePlayerId === playerId)
      .length > 0;

  return gameId ? (
    <SignalrContext value={signalr.current}>
      <Game
        key={gameId}
        gameId={gameId}
        leaveGame={clearCurrentGame}
        nextGame={nextGame}
        hasNextGame={hasNextGame}
      />
    </SignalrContext>
  ) : (
    <div className={styles.gameList}>
      <p>Hi {userName}!</p>
      <button
        onClick={async () => {
          if (!ready) {
            return;
          }
          const newGames = await signalr.current!.listGames();
          console.log(newGames);
          setGames(newGames);
        }}
      >
        Refresh List
      </button>
      <button
        onClick={async () => {
          if (!ready) {
            return;
          }
          const { gameId } = await signalr.current!.createGame();
          setGameId(gameId);
          console.log({ gameId });
        }}
      >
        Create Game
      </button>
      <h1>My Games</h1>
      <div className={styles.listings}>
        {myGames.map((game) => (
          <GameListing
            game={game}
            key={game.gameId}
            inGame={true}
            playerId={playerId!}
            joinGame={() => setGameId(game.gameId)}
            abandonGame={() => abandonGame(game.gameId)}
          />
        ))}
      </div>
      <h1>Other Games</h1>
      <div className={styles.listings}>
        {joinableGames.map((game) => (
          <GameListing
            game={game}
            key={game.gameId}
            inGame={false}
            playerId={playerId!}
            joinGame={() => joinGame(game.gameId)}
            abandonGame={() => abandonGame(game.gameId)}
          />
        ))}
      </div>
    </div>
  );
};

const GameListing = ({
  game,
  inGame,
  playerId,
  joinGame,
  abandonGame,
}: {
  game: Game;
  inGame: boolean;
  playerId: string;
  joinGame: () => void;
  abandonGame: () => void;
}): JSX.Element => {
  return (
    <div
      className={`${styles.gameListing} ${game.activePlayerId === playerId && styles.active}`}
    >
      {game.players.map((player, index) => (
        <p key={player}>
          Player {index + 1}: {player}
        </p>
      ))}
      {game.gameId}
      {inGame ? (
        <>
          <button onClick={joinGame}>Enter Game</button>
          <button onClick={abandonGame}>Abandon Game</button>
        </>
      ) : (
        <button onClick={joinGame}>Join Game</button>
      )}
    </div>
  );
};
