import { JSX } from "react";
import { SupplyPile } from "../cardPiles/SupplyPile";
import styles from "./Board.module.css";
import { selectKingdomCards } from "../game/gameSlice";
import { useAppSelector } from "../../app/hooks";
import { gridAreaMap } from "../card/cards";

export const Board = (): JSX.Element => {
  const kingdomCards = useAppSelector(selectKingdomCards)!;
  const defaults = kingdomCards.filter(
    (kc) => gridAreaMap[kc.cardId] !== undefined,
  );
  const nonDefaults = kingdomCards.filter(
    (kc) => gridAreaMap[kc.cardId] === undefined,
  );
  const defaultPiles = (
    <>
      {defaults.map((cardPile) => (
        <SupplyPile
          cardPile={cardPile}
          key={cardPile.cardId}
          gridArea={gridAreaMap[cardPile.cardId]}
        />
      ))}
    </>
  );

  const nonDefaultPiles = (
    <>
      {nonDefaults.map((cardPile, i) => (
        <SupplyPile
          cardPile={cardPile}
          key={cardPile.cardId}
          gridArea={`pile${i + 1}`}
          isCompact={false}
        />
      ))}
    </>
  );

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        <div className={styles.defaults}>{defaultPiles}</div>
        <div className={styles.nonDefaults}>{nonDefaultPiles}</div>
      </div>
    </div>
  );
};
