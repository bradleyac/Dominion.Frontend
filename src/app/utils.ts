import { CardInstance } from "../features/game/gameSlice";

export const isTouchDevice = () => {
  if ("ontouchstart" in window) {
    return true;
  }
  return false;
};

export const groupCards = (cards: CardInstance[], selectedCards: (string | number)[]): CardInstance[][] => {
  const groupedCards = cards.reduce((groups: { [key: number]: { unselected: CardInstance[], selected: CardInstance[] } }, card) => {
    if (!groups[card.cardId]) {
      groups[card.cardId] = { unselected: [], selected: [] };
    }
    if (selectedCards.includes(card.instanceId)) {
      groups[card.cardId].selected.push(card);
    } else {
      groups[card.cardId].unselected.push(card);
    }
    return groups;
  }, {});

  return Object.values(groupedCards).flatMap((group) => [group.unselected, group.selected]).filter(cards => cards.length > 0);
}