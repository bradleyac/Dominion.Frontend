import { DragEvent, JSX, useContext } from "react";
import { CardZone } from "./cards";
import styles from "./Card.module.css";
import {
  CardInstance,
  selectCardClickAction,
  toggleCard,
} from "../board/boardSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCardById } from "./cardsSlice";
import { SignalrContext } from "../../app/signalrContext";
import { GameContext } from "../game/gameContext";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../dnd/types";

export const Card = ({
  cardId,
  cardInstanceId,
  isCompact,
  zone,
  count,
}: {
  cardId: number;
  cardInstanceId?: string;
  isCompact: boolean;
  zone: CardZone;
  count?: number;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const signalrConnector = useContext(SignalrContext);
  const { gameId } = useContext(GameContext);
  const cardData = useAppSelector(state => selectCardById(state.cards, cardId));
  const clickAction = useAppSelector(state =>
    selectCardClickAction(state, cardData, zone, cardInstanceId),
  );
  let highlightClass = "";
  switch (clickAction) {
    case "buy":
      highlightClass = styles.highlightedBuy;
      break;
    case "play":
      highlightClass = styles.highlightedPlay;
      break;
    case "select":
      highlightClass = styles.highlightedSelect;
      break;
    case "deselect":
      highlightClass = styles.highlightedSelected;
      break;
    case "none":
      highlightClass = styles.dimmed;
      break;
  }

  function onClick() {
    switch (clickAction) {
      case "select":
      case "deselect":
        dispatch(toggleCard(cardInstanceId ?? cardId));
        return;
      case "buy":
        signalrConnector?.buyCard(gameId, cardId);
        return;
      case "play":
        if (cardInstanceId) {
          signalrConnector?.playCard(gameId, cardInstanceId);
        }
        return;
      case "none":
      default:
        return;
    }
  }
  return (
    <div className={`${styles.cardFrame}`}>
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
            {count !== undefined && (
              <div className={styles.remaining}>{count}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export const DraggableCard = ({
  cardInstance,
  zone,
}: {
  cardInstance: CardInstance;
  zone: CardZone;
}): JSX.Element | null => {
  const [, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: () => ({ cardInstanceId: cardInstance.instanceId })
  }))

  return drag(<div>
    <Card
      cardId={cardInstance.cardId}
      cardInstanceId={cardInstance.instanceId}
      isCompact={false}
      zone={zone}
    />
  </div>
  );
};
