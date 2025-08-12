import { PropsWithChildren, useState } from "react";
import { ToggleableIconButton } from "../modal/Modal";

import styles from "./Tray.module.css";

export const Tray = ({ children }: PropsWithChildren<{}>) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.trayContainer}>
      <div className={`${styles.tray} ${open ? styles.open : styles.closed}`}>
        {children}
      </div>
      <ToggleableIconButton toggled={open} icon="Ellipsis" title="More Options" onClick={() => setOpen(open => !open)} />
    </div>
  )
}