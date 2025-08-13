import { JSX } from "react";
import { SupplyPile } from "../cardPiles/SupplyPile";
import styles from "./Board.module.css";
import { CardPileState, selectKingdomCards } from "../game/gameSlice";
import { useAppSelector } from "../../app/hooks";
import { gridAreaMap } from "../card/cards";

export const Board = (): JSX.Element => {
  const kingdomCards = useAppSelector(selectKingdomCards)!;
  const defaults = kingdomCards.filter(kc => gridAreaMap[kc.cardId] !== undefined);
  const nonDefaults = kingdomCards.filter(kc => gridAreaMap[kc.cardId] === undefined);
  const defaultPiles = (<>{defaults.map((cardPile: CardPileState) => (
    <SupplyPile
      cardPile={cardPile}
      key={cardPile.cardId}
      gridArea={gridAreaMap[cardPile.cardId]}
    />
  ))}
  </>);

  let i = 1;

  const nonDefaultPiles = (<>{nonDefaults.map((cardPile: CardPileState) => (
    <SupplyPile
      cardPile={cardPile}
      key={cardPile.cardId}
      gridArea={`pile${i++}`}
      isCompact={false}
    />
  ))}
  </>);

  return (
    <div className={styles.board}>
      <div className={styles.defaults}>
        {defaultPiles}
      </div>
      {nonDefaultPiles}
    </div>
  );
};
