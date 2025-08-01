import { JSX, useEffect, useRef } from "react";
import { selectLog } from "../board/boardSlice";
import { useAppSelector } from "../../app/hooks";
import styles from "./Log.module.css";

export const Log = (): JSX.Element => {
  const log = useAppSelector(selectLog);
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
        {log.map((message, i) => (
          <p key={i}>{message}</p>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
