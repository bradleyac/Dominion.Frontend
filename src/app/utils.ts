import { CardInstance } from "../features/game/gameSlice";

export const isTouchDevice = () => {
  if ("ontouchstart" in window) {
    return true;
  }
  return false;
};

// TODO: This doesn't work either. You can end up with cards moving around after some of the stack is played.
export const groupCards = (
  cards: CardInstance[],
  selectedCards: (string | number)[],
): CardInstance[][] => {
  const groupedCards = cards.reduce(
    (
      groups: {
        [key: number]: {
          unselected: CardInstance[];
          selected: CardInstance[];
          firstIndex: number;
        };
      },
      card,
      idx,
    ) => {
      groups[card.cardId] ??= { unselected: [], selected: [], firstIndex: idx };

      if (selectedCards.includes(card.instanceId)) {
        groups[card.cardId].selected.push(card);
      } else {
        groups[card.cardId].unselected.push(card);
      }
      return groups;
    },
    {},
  );

  return Object.values(groupedCards)
    .sort(({ firstIndex: aIndex }, { firstIndex: bIndex }) => aIndex - bIndex)
    .flatMap((group) => [group.unselected, group.selected])
    .filter((cards) => cards.length > 0);
};

export const groupAdjacentCards = (cards: CardInstance[]): CardInstance[][] =>
  cards.reduce((groups, card) => {
    if (groups.at(-1)?.[0].cardId === card.cardId) {
      groups[groups.length - 1].push(card);
      return groups;
    }
    groups.push([card]);
    return groups;
  }, [] as CardInstance[][]);
