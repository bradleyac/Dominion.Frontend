import { useContext, useState } from "react";
import { IconButton, ToggleableIconButton } from "../modal/Modal";

import styles from "./Tray.module.css";
import { GameInfoButton } from "../gameInfo/GameInfo";
import { HistoryButton } from "../history/History";
import { SignalrContext } from "../../app/signalrContext";
import { GameContext } from "../game/gameContext";
import { KingdomButton } from "../kingdom/Kingdom";

export const Tray = ({ leaveGame }: { leaveGame: () => Promise<void> }) => {
  const [open, setOpen] = useState(false);
  const signalrConnector = useContext(SignalrContext);
  const { gameId } = useContext(GameContext);
  return (
    <div className={styles.trayContainer}>
      <ToggleableIconButton toggled={open} icon="Ellipsis" title="More Options" animation="rotate" onClick={() => setOpen(open => !open)} />
      <div className={`${styles.tray} ${open ? styles.openRight : styles.closedRight}`}>
        <IconButton icon="Leave" title="Leave Game" onClick={leaveGame} lit={false} />
        <KingdomButton />
        <GameInfoButton />
        <HistoryButton />
        <IconButton icon="Undo" title="Undo" onClick={() => signalrConnector?.undo(gameId)} lit={false} />
      </div>
    </div>
  )
}