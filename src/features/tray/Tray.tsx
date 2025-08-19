import { useState } from "react";
import { IconButton, ToggleableIconButton } from "../modal/Modal";

import styles from "./Tray.module.css";
import { GameInfoButton } from "../gameInfo/GameInfo";
import { HistoryButton } from "../history/History";

export const Tray = ({ leaveGame }: { leaveGame: () => Promise<void> }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.trayContainer}>
      <div
        className={`${styles.tray} ${open ? styles.openRight : styles.closedRight}`}
      >
        <div className={styles.buttons}>
          <GameInfoButton />
          <HistoryButton />
          <IconButton
            icon="Leave"
            title="Leave Game"
            onClick={leaveGame}
            lit={false}
          />
        </div>
      </div>
      <ToggleableIconButton
        toggled={open}
        icon="Ellipsis"
        title="More Options"
        animation="rotate"
        onClick={() => setOpen((open) => !open)}
      />
    </div>
  );
};
