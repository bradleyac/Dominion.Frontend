import { JSX, useEffect, useRef, useState } from "react";
import { selectLog } from "../game/gameSlice";
import { useAppSelector } from "../../app/hooks";
import styles from "./History.module.css";
import { ModalButton } from "../modal/Modal";
import { DraggableFrame } from "../draggableFrame/DraggableFrame";

export const HistoryButton = () => (<ModalButton icon="History" title="View Game History">
  <History />
</ModalButton>);

export const History = (): JSX.Element => {
  const log = useAppSelector(selectLog)!;
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const logRef = useRef<null | HTMLDivElement>(null);
  const [scrolledTop, setScrolledTop] = useState(false);
  const [scrolledBottom, setScrolledBottom] = useState(false);

  const onScroll: React.UIEventHandler<HTMLDivElement> = () => {
    setScrolledTop((logRef.current?.scrollTop ?? 0) > 5);
    setScrolledBottom((logRef.current?.scrollTop ?? 0) + (logRef.current?.offsetHeight ?? 0) + 5 < (logRef.current?.scrollHeight ?? 0));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [log]);

  return (
    <DraggableFrame>
      <div className={styles.log}>
        History
        {scrolledTop && <div className={styles.scrolledTop}>^</div>}
        <div ref={logRef} className={`${styles.messages}`} onScroll={onScroll}>
          {log?.map((message, i) => (
            <p key={i} className={message.includes("turn") ? styles.turnMarker : ""}>{message}</p>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {scrolledBottom && <div className={styles.scrolledBottom}>^</div>}
      </div>
    </DraggableFrame>
  );
};
