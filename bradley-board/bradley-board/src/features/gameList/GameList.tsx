import { JSX, useEffect, useRef, useState } from "react"
import getSignalrInstance from "../../app/signalrConnection";
import { Game } from "../game/Game";
import { SignalrContext } from "../../app/signalrContext";

export const GameList = (): JSX.Element => {
  const connector = useRef(getSignalrInstance());
  const [games, setGames] = useState<string[]>([]);
  const [playerId, setPlayerId] = useState<string | undefined>(undefined);
  useEffect(() => {
    return connector.current.gameListEvents({
      onGameCreated: (gameId: string) => { console.log(gameId); setGames(games => [...games, gameId]) }
    });
  }, [])

  return playerId && games.length > 0
    ? <SignalrContext value={connector.current}>
      <Game gameId={games[0]} playerId={playerId} />
    </SignalrContext>
    : <div>
      <button onClick={async () => {
        const newGames = await connector.current.listGames();
        console.log(newGames);
        setGames(newGames);
      }}>Refresh List</button>
      <button onClick={async () => {
        const { playerId, gameId } = await connector.current.createGame();
        setPlayerId(playerId);
        console.log({ playerId, gameId });
      }}>Create Game</button>
      Games:
      {games.length > 0 && games.map(gameId => <div key={gameId}>{gameId}
        <button onClick={async () => {
          const { playerId } = await connector.current.joinGame(gameId);
          setPlayerId(playerId);
          console.log({ playerId, gameId });
        }}>Join Game</button>
      </div>)}
    </div>
}