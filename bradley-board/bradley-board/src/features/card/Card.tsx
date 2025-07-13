import { JSX, useContext } from "react";
import { CardZone, type CardData } from "./cards";
import styles from "./Card.module.css";
import { selectCardClickAction, selectCurrentPlayer, toggleCard } from "../board/boardSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCardById } from "./cardsSlice";
import { SignalrContext } from "../../app/signalrContext";
import { GameContext } from "../game/gameContext";

export const Card = ({
  cardId,
  cardInstanceId,
  isCompact,
  zone,
  count,
}: {
  cardId: number,
  cardInstanceId?: string,
  isCompact: boolean;
  zone: CardZone;
  count?: number,
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const signalrConnector = useContext(SignalrContext);
  const { gameId, playerId } = useContext(GameContext);
  const cardData = useAppSelector(state => selectCardById(state.cards, cardId));
  const clickAction = useAppSelector(state =>
    selectCardClickAction(state, cardData, zone, cardInstanceId)
  );
  let highlightClass = "";
  switch (clickAction) {
    case "buy": highlightClass = styles.highlightedBuy; break;
    case "play": highlightClass = styles.highlightedPlay; break;
    case "select": highlightClass = styles.highlightedSelect; break;
    case "deselect": highlightClass = styles.highlightedSelected; break;
    case "none": highlightClass = styles.dimmed; break;
  }

  function onClick() {
    switch (clickAction) {
      case "select":
      case "deselect": dispatch(toggleCard(cardInstanceId ?? cardId)); return;
      case "buy": signalrConnector?.buyCard(gameId, playerId, cardId); return;
      case "play": if (cardInstanceId) { signalrConnector?.playCard(gameId, playerId, cardInstanceId); } return;
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
            {count !== undefined && <div className={styles.remaining}>{count}</div>}
          </>
        )}
      </div>
    </div>
  );
};