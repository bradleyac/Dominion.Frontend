import { JSX, useEffect, useRef } from "react";
import { selectLog } from "../game/gameSlice";
import { useAppSelector } from "../../app/hooks";
import styles from "./History.module.css";
import { ModalButton } from "../modal/Modal";

export const HistoryButton = () => (<ModalButton text="History" title="View Game History">
  <History />
</ModalButton>);

export const History = (): JSX.Element => {
  const log = useAppSelector(selectLog)!;
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [log]);

  return (
    <div className={styles.log}>
      History
      <div>
        {log?.map((message, i) => (
          <p key={i}>{message}</p>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
