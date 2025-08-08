import { JSX, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Game } from "../game/Game";
import { SignalrContext } from "../../app/signalrContext";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectIsAuthenticated,
  selectPlayerId,
} from "../auth/authSlice";
import { useNavigate } from "react-router";
import { useSignalr } from "../../app/useSignalr";
import { clearGame, updateState } from "../game/gameSlice";
import styles from "./GameList.module.css";
import { AuthContext, IAuthContext } from "react-oauth2-code-pkce";

export type Game = {
  activePlayerId?: string;
  displayName: string;
  gameId: string;
  players: string[];
};

export const GameList = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { ready, signalr } = useSignalr();
  const [games, setGames] = useState<Game[]>([]);
  const [gameId, setGameId] = useState<string | undefined>(undefined);
  const playerId = useAppSelector(selectPlayerId);
  const authenticated = useAppSelector(selectIsAuthenticated);
  const ctx = useContext<IAuthContext>(AuthContext);
  console.log(ctx);

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
    const intervalId = setInterval(() => signalr.current?.listGames().then((games) => setGames(games)), 30000);
    return () => clearInterval(intervalId);
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

  async function createGame() {
    if (!ready) {
      return;
    }
    const { gameId } = await signalr.current!.createGame();
    setGameId(gameId);
    console.log({ gameId });
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
      <h1>Your Games</h1>
      <div className={styles.listings}>
        <NewGameListing createGame={createGame} />
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
      onClick={joinGame}
    >
      <h2 className={styles.name}>{game.displayName}</h2>
      <div className={styles.players}>
        {game.players.map((player) => (
          <PlayerEntry key={player}>
            {player}
          </PlayerEntry>
        ))}
      </div>
      {inGame && <button title="Abandon Game" className={`${styles.abandon} icon iconClose`} onClick={abandonGame}></button>}
    </div>
  );
};

const NewGameListing = ({
  createGame,
}: {
  createGame: () => void;
}): JSX.Element => <div className={styles.emptyListing}>
    <button title="New Game" className={`${styles.enter} icon iconAdd`} onClick={createGame}></button>
  </div>;

// const PlayerEntry = ({ children }: PropsWithChildren<void>())) => 

export const PlayerEntry = ({
  children,
}: PropsWithChildren<{
}>): JSX.Element | null => <div className={styles.playerEntry}><PlayerIcon />{children}</div>;

const PlayerIcon = () => <span className="icon iconUser"></span>;