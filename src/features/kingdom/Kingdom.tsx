import { useState } from "react";
import { createPortal } from "react-dom";
import {
  selectNonDefaultKingdomCards,
} from "../game/gameSlice";
import { useAppSelector } from "../../app/hooks";
import { Card } from "../card/Card";

import styles from "./Kingdom.module.css";

export const KingdomButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        className={styles.kingdomButton}
        onClick={() => setShowModal(true)}
      >
        Kingdom
      </button>
      {showModal &&
        createPortal(
          <Kingdom onClose={() => setShowModal(false)} />,
          document.getElementById("root")!,
        )}
    </>
  );
};

export const Kingdom = ({ onClose }: { onClose: () => void }) => {
  const kingdomCards = useAppSelector(selectNonDefaultKingdomCards);

  return (
    <div className={styles.kingdomOverlay} onClick={onClose}>
      <div className={styles.kingdom}>
        <h1>Kingdom Cards</h1>
        <div className={styles.cards} onClick={(e) => e.stopPropagation()}>
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
    </div>
  );
};
