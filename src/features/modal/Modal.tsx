import { PropsWithChildren, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

export type IconType = "Kingdom" | "History" | "Info" | "Leave" | "Undo" | "EndTurn" | "EndPhase" | "Coins" | "Actions" | "Buys" | "Cleanup" | "Ellipsis";

export const ToggleableIconButton = ({ icon, title, toggled, onClick }: { icon: IconType, title: string, toggled: boolean, onClick: () => void }) => {
  return (
    <button className={`${styles.iconButton} icon icon${icon} ${styles.toggleable} ${toggled && styles.toggled}`} title={title} onClick={onClick}>
    </button>
  );
}

export const IconButton = ({ icon, title, lit, onClick, disabled = false }: { icon: IconType, title: string, lit: boolean, onClick: () => void, disabled?: boolean }) => {
  return (
    <button disabled={disabled} className={`${styles.iconButton} icon icon${icon} ${lit && styles.lit}`} title={title} onClick={onClick}>
    </button>
  );
}

export const ModalButton = ({ text, icon, title, children }: PropsWithChildren<{ text?: string, icon?: IconType, title: string }>) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {icon ? <IconButton icon={icon} lit={false} title={title} onClick={() => setShowModal(true)} />
        : <button title={title} onClick={() => setShowModal(true)}>{text ?? ""}</button>}
      <Modal showing={showModal} close={() => setShowModal(false)}>
        {children}
      </Modal>
    </>
  )
}

export const Modal = ({ showing, close, children }: PropsWithChildren<{ showing: boolean, close: () => void }>) => {
  if (!showing) {
    return;
  }

  return (
    createPortal(
      <div className={styles.modalOverlay} onClick={close}>
        {children}
      </div>,
      document.getElementById("root")!,
    ))
}