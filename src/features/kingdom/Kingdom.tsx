import { selectNonDefaultKingdomCards } from "../game/gameSlice";
import { useAppSelector } from "../../app/hooks";
import { Card } from "../card/Card";

import styles from "./Kingdom.module.css";
import { ModalButton } from "../modal/Modal";

export const KingdomButton = () => (
  <ModalButton icon="Kingdom" title="View Kingdom Cards">
    <Kingdom />
  </ModalButton>
);

export const Kingdom = () => {
  const kingdomCards = useAppSelector(selectNonDefaultKingdomCards);

  return (
    <div className={styles.kingdom}>
      <h1>Kingdom Cards</h1>
      <div className={styles.cards} onClick={(e) => e.stopPropagation()}>
        {kingdomCards.map((card, i) => (
          <div
            style={{ width: "100%", height: "100%", gridArea: `pile${i + 1}` }}
          >
            <Card
              key={card.cardId}
              selectable={false}
              cardId={card.cardId}
              zone={"Supply"}
              isCompact={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
