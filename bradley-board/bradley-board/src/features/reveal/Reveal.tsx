import { JSX } from "react";
import styles from "./Reveal.module.css";
import { CardInstance, PlayerSelectChoice, selectActiveChoice, selectPrivateReveal, selectReveal } from "../board/boardSlice";
import { useAppSelector } from "../../app/hooks";
import { Card } from "../card/Card";

export const Reveal = (): JSX.Element => {
  const reveal = useAppSelector(selectReveal);
  const choice = useAppSelector(selectActiveChoice);
  const show = choice?.$type === "select" && (choice as PlayerSelectChoice).filter.from === "Reveal";
  if (!show) {
    return <></>;
  }

  const cards = reveal.map((cardInstance: CardInstance) => (
    <Card
      cardId={cardInstance.cardId}
      cardInstanceId={cardInstance.instanceId}
      key={cardInstance.instanceId}
      isCompact={false}
      zone="Reveal"
    />
  ));

  return (
    <div className={styles.reveal}>
      <div className={styles.title}>Revealed Cards</div>
      <div className={styles.revealedCards}>{cards}</div>
    </div>
  );
}

export const PrivateReveal = (): JSX.Element => {
  const privateReveal = useAppSelector(selectPrivateReveal);
  const choice = useAppSelector(selectActiveChoice);
  const show = choice?.$type === "select" && (choice as PlayerSelectChoice).filter.from === "PrivateReveal";
  if (!show) {
    return <></>;
  }

  const cards = privateReveal.map((cardInstance: CardInstance) => (
    <Card
      cardId={cardInstance.cardId}
      cardInstanceId={cardInstance.instanceId}
      key={cardInstance.instanceId}
      isCompact={false}
      zone="PrivateReveal"
    />
  ));

  return (
    <div className={styles.reveal}>
      <div className={styles.title}>Privately Revealed Cards</div>
      <div className={styles.revealedCards}>{cards}</div>
    </div>
  );
}