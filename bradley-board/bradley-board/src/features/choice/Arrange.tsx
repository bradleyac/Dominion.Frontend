import { JSX, PropsWithChildren, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  CardInstance,
  cardsArranged,
  PlayerArrangeChoice,
  selectActiveChoice,
  selectArrangedCards,
  selectPrivateReveal,
} from "../board/boardSlice";
import { DraggableCard } from "../card/Card";
import styles from "./Arrange.module.css";

export const Arrange = (): JSX.Element => {
  const choice = useAppSelector(selectActiveChoice);
  const cards = useAppSelector(selectPrivateReveal);
  return (
    <>
      {choice && choice.$type === "arrange" && (
        <ArrangeImpl choice={choice as PlayerArrangeChoice} cards={cards} />
      )}
    </>
  );
};

export const ArrangeImpl = ({
  choice,
  cards,
}: {
  choice: PlayerArrangeChoice;
  cards: CardInstance[];
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const arranged = useAppSelector(selectArrangedCards);

  useEffect(() => {
    dispatch(cardsArranged(cards));
  }, [choice.id]);

  function setCardIndex(cardInstanceId: string, newIndex: number) {
    const oldIndex = arranged.findIndex(c => c.instanceId === cardInstanceId);
    const newArranged = [
      ...arranged.slice(0, oldIndex),
      ...arranged.slice(oldIndex + 1),
    ];
    newArranged.splice(newIndex, 0, arranged[oldIndex]);
    dispatch(cardsArranged(newArranged));
  }

  return (
    <div className={styles.arrange}>
      <div className={styles.cards}>
        {arranged.map((cardInstance, index) => (
          <IndexedZone key={index} index={index} arrangeCallback={setCardIndex}>
            <DraggableCard
              key={cardInstance.instanceId}
              cardInstance={cardInstance}
              zone="PrivateReveal"
            />
          </IndexedZone>
        ))}
      </div>
    </div>
  );
};

export const IndexedZone = ({
  index,
  arrangeCallback,
  children,
}: PropsWithChildren<{
  index: number;
  arrangeCallback: (cardInstanceId: string, newIndex: number) => void;
}>): JSX.Element => {
  return (
    <div
      className={styles.zone}
      onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
      onDrop={e => { e.preventDefault(); arrangeCallback(e.dataTransfer.getData("text/plain"), index) }}
    >
      {children}
    </div>
  );
};
