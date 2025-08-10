import { PropsWithChildren, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

export const ModalButton = ({ text, title, children }: PropsWithChildren<{ text: string, title: string }>) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button title={title} onClick={() => setShowModal(true)}>{text}</button>
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