import {
  selectNonDefaultKingdomCards,
} from "../game/gameSlice";
import { useAppSelector } from "../../app/hooks";
import { Card } from "../card/Card";

import styles from "./Kingdom.module.css";
import { ModalButton } from "../modal/Modal";

export const KingdomButton = () => (<ModalButton icon="Kingdom" title="View Kingdom Cards">
  <Kingdom />
</ModalButton>);

export const Kingdom = () => {
  const kingdomCards = useAppSelector(selectNonDefaultKingdomCards);

  return (
    <div className={styles.kingdom}>
      <h1>Kingdom Cards</h1>
      <div className={styles.cards} onClick={e => e.stopPropagation()}>
        {kingdomCards.map((c) => (
          <Card
            key={c.cardId}
            selectable={false}
            cardId={c.cardId}
            zone={"Supply"}
            isCompact={false}
          />
        ))}
      </div>
    </div>
  );
};

