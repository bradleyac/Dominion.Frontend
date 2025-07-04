import { JSX } from "react";
import { CardZone, type CardData } from "./cards";
import styles from "./Card.module.css";
import { buyCard, CardInstance, playCard, selectCardClickAction, selectCurrentPlayer, toggleCard } from "../board/boardSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

export const Card = ({
  card,
  isCompact,
  zone,
  count,
}: {
  card: CardData | CardInstance;
  isCompact: boolean;
  zone: CardZone;
  count?: number,
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const cardData = card.type === "data" ? card as CardData : card.card;
  const cardInstanceId = card.type === "instance" ? card.id : undefined;
  const clickAction = useAppSelector(state =>
    selectCardClickAction(state, cardData, zone, selectCurrentPlayer(state), cardInstanceId)
  );
  let highlightClass = "";
  switch (clickAction) {
    case "buy": highlightClass = styles.highlightedBuy; break;
    case "play": highlightClass = styles.highlightedPlay; break;
    case "select": highlightClass = styles.highlightedSelect; break;
    case "deselect": highlightClass = styles.highlightedSelected; break;
  }

  function onClick() {
    switch (clickAction) {
      case "select":
      case "deselect": dispatch(toggleCard(card)); return;
      case "buy": dispatch(buyCard(cardData.id)); return;
      case "play": dispatch(playCard(card.id)); return;
      case "none":
      default: return;
    }
  }
  return (
    <div
      className={`${styles.cardFrame}`}
    >
      <div
        className={`${styles.card} ${styles.cardFront} ${highlightClass} ${isCompact ? styles.compact : ""}`}
        style={{ backgroundImage: `url(${cardData.imgSrc})` }}
        onClick={onClick}
      >
        {isCompact && (
          <>
            <div
              className={styles.cardBottom}
              style={{ backgroundImage: `url(${cardData.imgSrc})` }}
            />
            {count && <div className={styles.remaining}>{count}</div>}
          </>
        )}
      </div>
    </div>
  );
};