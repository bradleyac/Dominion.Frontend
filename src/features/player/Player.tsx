import { JSX } from "react";
import {
  CardInstance,
  selectActivePlayer,
  selectHand,
  selectSelectedCards,
} from "../game/gameSlice";
import { Card } from "../card/Card";
import styles from "./Player.module.css";
import { useAppSelector } from "../../app/hooks";
import { selectPlayerId } from "../auth/authSlice";
import { groupCards } from "../../app/utils";


export const Hand = ({ hand }: { hand: CardInstance[] }): JSX.Element => {
  const selectedCards = useAppSelector(selectSelectedCards);
  const expandedGroups = groupCards(hand, selectedCards);

  const cards = expandedGroups.map(cards => {
    console.log(cards);
    const topCard = cards[0];
    return (
      <Card
        cardId={topCard.cardId}
        cardInstanceId={topCard.instanceId}
        key={topCard.instanceId}
        isCompact={false}
        zone="Hand"
        count={cards.length}
      />
    );
  });

  return <div className={styles.hand}>{cards}</div>;
};

export const Player = (): JSX.Element => {
  const hand = useAppSelector(selectHand);
  const myName = useAppSelector(selectPlayerId);
  const activePlayer = useAppSelector(selectActivePlayer);
  return (
    <div
      className={`${styles.hud} ${activePlayer === myName ? styles.hudActive : ""}`}
    >
      <div className={styles.playerName}>{myName}</div>
      <Hand hand={hand} />
    </div>
  );
};
