import { JSX } from "react";
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
  // const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView();
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [log]);

  return (
    <DraggableFrame>
      <div className={styles.log}>
        History
        <div className={styles.messages}>
          {log?.map((message, i) => (
            <p key={i}>{message}</p>
          ))}
          {/* <div ref={messagesEndRef} /> */}
        </div>
      </div>
    </DraggableFrame>
  );
};
