import { JSX, PropsWithChildren, useEffect, useState } from "react";
import styles from "./Categorize.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  CardCategorizations,
  cardCategorized,
  CardInstance,
  PlayerCategorizeChoice,
  selectActiveChoice,
  selectCategorizations,
  selectPrivateReveal,
} from "../board/boardSlice";
import { DraggableCard } from "../card/Card";

export const Categorize = (): JSX.Element => {
  const choice = useAppSelector(selectActiveChoice);
  const cards = useAppSelector(selectPrivateReveal);
  return (
    <>
      {choice && choice.$type === "categorize" && (
        <CategorizeImpl
          key={choice.id}
          choice={choice as PlayerCategorizeChoice}
          cards={cards}
        />
      )}
    </>
  );
};

export const CategorizeImpl = ({
  choice,
  cards,
}: {
  choice: PlayerCategorizeChoice;
  cards: CardInstance[];
}): JSX.Element => {
  const [categorized, setCategorized] = useState<CardCategorizations>(
    cards.reduce((acc, c) => {
      acc[c.instanceId] = choice.defaultCategory;
      return acc;
    }, {} as CardCategorizations),
  );
  const dispatch = useAppDispatch();
  const groupedCategorizations = useAppSelector(selectCategorizations);

  useEffect(() => {
    dispatch(cardCategorized(categorized));
  }, [choice.id]);

  const cardsByCategory = Object.fromEntries(
    Object.entries(groupedCategorizations).map(([category, ids]) => [
      category,
      cards.filter(card => ids.includes(card.instanceId)),
    ]),
  );

  function setCardCategory(cardInstanceId: string, category: string) {
    const newCategorized = {
      ...categorized,
      [cardInstanceId]: category,
    };
    setCategorized(newCategorized);
    dispatch(cardCategorized(newCategorized));
  }

  return (
    <div className={styles.categorize}>
      {choice.categories.map(category => (
        <CategoryZone
          key={category}
          category={category}
          categorizeCallback={setCardCategory}
        >
          {cardsByCategory[category]?.map(cardInstance => (
            <DraggableCard
              key={cardInstance.instanceId}
              cardInstance={cardInstance}
              zone="PrivateReveal"
            />
          ))}
        </CategoryZone>
      ))}
    </div>
  );
};

export const CategoryZone = ({
  category,
  categorizeCallback,
  children,
}: PropsWithChildren<{
  category: string;
  categorizeCallback: (cardInstanceId: string, newCategory: string) => void;
}>): JSX.Element => {
  return (
    <div
      className={styles.zone}
      onDragOver={e => e.preventDefault()}
      onDrop={e =>
        categorizeCallback(e.dataTransfer.getData("text/plain"), category)
      }
    >
      <h2>{category}</h2>
      <div className={styles.cards}>{children}</div>
    </div>
  );
};
