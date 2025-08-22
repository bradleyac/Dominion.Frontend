import styles from "./CardPile.module.css";
import { ReactiveCount } from "../reactiveCount/ReactiveCount";
import { selectCardById } from "../card/cardsSlice";
import { useAppSelector } from "../../app/hooks";
import { selectDeckCount, selectDiscardCount, selectDiscardTopCard } from "../game/gameSlice";

export const CardPile = ({ count, cardId = -1 }: { count: number, cardId?: number }) => {
  const cardData = useAppSelector((state) =>
    selectCardById(state.cards, cardId),
  );
  const imgUrl = cardId === -1 ? "/card-images/card-back.png" : cardData.imgSrc;
  const pileStyle = { "--layers-count": count, "--imgUrl": `url(${imgUrl})` } as React.CSSProperties;
  return (
    <div className={styles.pile} style={pileStyle}>
      <div className={styles.layers} aria-hidden="true">
        {[...Array(count).keys()].map(i => {
          const style = { "--i": i } as React.CSSProperties
          return (
            <div key={i} className={styles.layer} style={style}>
              {i === count - 1 && <div className={styles.remaining}><ReactiveCount count={count} /></div>}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export const Deck = () => {
  const deckCount = useAppSelector(selectDeckCount);
  return <CardPile count={deckCount} />
}

export const Discard = () => {
  const discardCount = useAppSelector(selectDiscardCount);
  const discardTopCardId = useAppSelector(selectDiscardTopCard);
  return <CardPile count={discardCount!} cardId={discardTopCardId} />
}