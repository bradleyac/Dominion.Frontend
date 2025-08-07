import { JSX, useContext } from "react";
import { ActionType, CardZone } from "./cards";
import styles from "./Card.module.css";
import {
  CardInstance,
  selectCardClickAction,
  toggleCard,
} from "../game/gameSlice";
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
  selectable = true,
}: {
  cardId: number;
  cardInstanceId?: string;
  isCompact: boolean;
  zone: CardZone;
  count?: number;
  selectable?: boolean;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const signalrConnector = useContext(SignalrContext);
  const { gameId } = useContext(GameContext);
  const cardData = useAppSelector((state) =>
    selectCardById(state.cards, cardId),
  );
  const clickAction = useAppSelector((state) =>
    selectCardClickAction(state, cardData, zone, cardInstanceId),
  );
  const highlightClass = selectable ? getHighlightClass(clickAction) : "";

  function onClick() {
    if (!selectable) {
      return;
    }

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
    item: () => ({ cardInstanceId: cardInstance.instanceId }),
  }));

  return drag(
    <div>
      <Card
        cardId={cardInstance.cardId}
        cardInstanceId={cardInstance.instanceId}
        isCompact={false}
        zone={zone}
      />
    </div>,
  );
};

function getHighlightClass(clickAction: ActionType) {
  switch (clickAction) {
    case "buy":
      return styles.highlightedBuy;
    case "play":
      return styles.highlightedPlay;
    case "select":
      return styles.highlightedSelect;
    case "deselect":
      return styles.highlightedSelected;
    case "none":
      return styles.dimmed;
  }
}
