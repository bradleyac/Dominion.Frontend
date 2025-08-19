import { JSX } from "react";
import styles from "./Reveal.module.css";
import {
  PlayerSelectChoice,
  selectActiveChoice,
  selectPrivateReveal,
  selectReveal,
  selectSelectedCards,
} from "../game/gameSlice";
import { useAppSelector } from "../../app/hooks";
import { Card } from "../card/Card";
import { groupCards } from "../../app/utils";

export const Reveal = (): JSX.Element => {
  const reveal = useAppSelector(selectReveal);
  const selectedCards = useAppSelector(selectSelectedCards);
  const choice = useAppSelector(selectActiveChoice);
  const show =
    choice?.$type === "select" &&
    (choice as PlayerSelectChoice).filter.from === "Reveal";
  if (!show) {
    return <></>;
  }

  const groupedCards = groupCards(reveal, selectedCards);
  const mappedCards = groupedCards.map(cards => {
    console.log(cards);
    const topCard = cards[0];
    return (
      <Card
        cardId={topCard.cardId}
        cardInstanceId={topCard.instanceId}
        key={topCard.instanceId}
        isCompact={false}
        zone="Reveal"
        count={cards.length}
      />
    );
  });

  return (
    <div className={styles.reveal}>
      <div className={styles.title}>Revealed Cards</div>
      <div className={styles.revealedCards}>{mappedCards}</div>
    </div>
  );
};

export const PrivateReveal = (): JSX.Element => {
  const privateReveal = useAppSelector(selectPrivateReveal);
  const selectedCards = useAppSelector(selectSelectedCards);
  const choice = useAppSelector(selectActiveChoice);
  const show =
    choice?.$type === "select" &&
    (choice as PlayerSelectChoice).filter.from === "PrivateReveal";
  if (!show) {
    return <></>;
  }

  const groupedCards = groupCards(privateReveal, selectedCards);
  const mappedCards = groupedCards.map(cards => {
    console.log(cards);
    const topCard = cards[0];
    return (
      <Card
        cardId={topCard.cardId}
        cardInstanceId={topCard.instanceId}
        key={topCard.instanceId}
        isCompact={false}
        zone="PrivateReveal"
        count={cards.length}
      />
    );
  });

  return (
    <div className={styles.reveal}>
      <div className={styles.title}>Privately Revealed Cards</div>
      <div className={styles.revealedCards}>{mappedCards}</div>
    </div>
  );
};
