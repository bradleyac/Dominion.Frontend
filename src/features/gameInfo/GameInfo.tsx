import { useAppSelector } from "../../app/hooks";
import { selectActivePlayer, selectCurrentPlayer, selectGameDisplayName, selectMyPlayerId, selectPhase, selectPlayerIds, selectTurn } from "../game/gameSlice";
import { KingdomButton } from "../kingdom/Kingdom";
import styles from "./GameInfo.module.css";

export const GameInfo = () => {
  const gameName = useAppSelector(selectGameDisplayName);
  const turn = useAppSelector(selectTurn);
  const currentPlayerId = useAppSelector(selectCurrentPlayer);
  const currentPhase = useAppSelector(selectPhase);
  const activePlayerId = useAppSelector(selectActivePlayer);
  const myPlayerId = useAppSelector(selectMyPlayerId);
  const allPlayers = useAppSelector(selectPlayerIds);

  return (
    <section className={styles.container}>
      <h2 className={styles.name}>{gameName}</h2>
      <div className={styles.kingdom}><KingdomButton /></div>
      <p className={styles.turn}>Turn {turn}</p>
      <p className={styles.phase}>{currentPhase} Phase</p>
      <div className={styles.players}>
        {allPlayers.map(player => <Player key={player} player={player} myPlayerId={myPlayerId} activePlayerId={activePlayerId} currentPlayerId={currentPlayerId} />)}
      </div>
    </section>
  );
}

const Player = ({ player, myPlayerId, activePlayerId, currentPlayerId }: { player: string, myPlayerId: string, activePlayerId?: string, currentPlayerId: string }) => {
  const isMe = player === myPlayerId;
  const isActive = player === activePlayerId;
  const isCurrent = player === currentPlayerId;
  return (
    <div className={`${styles.player} ${isMe && styles.myPlayer} ${isActive && styles.activePlayer} ${isCurrent && styles.currentPlayer}`}>
      {player}
    </div>
  );
}