import { JSX, PropsWithChildren, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  CardInstance,
  cardsArranged,
  PlayerArrangeChoice,
  selectActiveChoice,
  selectArrangedCards,
  selectPrivateReveal,
} from "../game/gameSlice";
import { DraggableCard } from "../card/Card";
import styles from "./Arrange.module.css";
import { useDrop } from "react-dnd";
import { CardPayload, ItemTypes } from "../dnd/types";

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
    const oldIndex = arranged.findIndex((c) => c.instanceId === cardInstanceId);
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
              isCompact={false}
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
}>): JSX.Element | null => {
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: (item: CardPayload) => {
        arrangeCallback(item.cardInstanceId, index);
      },
    }),
    [index, arrangeCallback],
  );

  return drop(<div className={styles.zone}>{children}</div>);
};
