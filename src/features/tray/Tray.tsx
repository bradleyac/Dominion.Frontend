import { PropsWithChildren, useState } from "react";
import { ToggleableIconButton } from "../modal/Modal";

import styles from "./Tray.module.css";

export const Tray = ({ children }: PropsWithChildren<{}>) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.trayContainer}>
      <div className={`${styles.tray} ${open ? styles.openRight : styles.closedRight}`}>
        {children}
      </div>
      <ToggleableIconButton toggled={open} icon="Ellipsis" title="More Options" animation="rotate" onClick={() => setOpen(open => !open)} />
    </div>
  )
}

export const ArrowTray = ({ children }: PropsWithChildren<{}>) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.arrowTrayContainer}>
      <div className={`${styles.arrowTray} ${open ? styles.openLeft : styles.closedLeft}`}>
        {children}
        <ToggleableIconButton toggled={open} icon="Triangle" title="Expand" animation="flip" onClick={() => setOpen(open => !open)} />
      </div>
    </div>
  )
}