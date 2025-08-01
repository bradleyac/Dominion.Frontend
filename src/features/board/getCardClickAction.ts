import {
  BoardSliceState,
  PlayerChoice,
  PlayerResources,
  PlayerSelectChoice,
} from "./boardSlice";
import { ActionType, CardData, CardZone } from "../card/cards";

export function getCardClickAction(
  state: BoardSliceState,
  playerId: string,
  card: CardData,
  zone: CardZone,
  resources: PlayerResources,
  selectedCards: (number | string)[],
  cardInstanceId?: string,
  choice?: PlayerChoice,
): ActionType {
  const { turnState } = state.gameState;
  if (choice && choice.$type === "select") {
    const filter = (choice as PlayerSelectChoice).filter;

    if (
      filter?.from === zone &&
      (selectedCards.includes(card.id) ||
        (cardInstanceId && selectedCards.includes(cardInstanceId)))
    ) {
      // This card is currently selected, so allow deselection
      return "deselect";
    }

    // If the supply pile is empty, don't allow selection.
    if (
      filter.from === "Supply" &&
      !state.gameState.kingdomState.supply.find(
        cps => cps.cardId === card.id && cps.count > 0,
      )
    ) {
      return "none";
    }

    if (
      filter?.from === zone &&
      card.id !== (filter?.notId ?? Number.MAX_VALUE) &&
      (!filter.cardId || card.id === filter.cardId) &&
      (!filter.types ||
        card.types.filter(c => filter.types!.includes(c)).length > 0) &&
      card.cost >= (filter?.minCost ?? 0) &&
      card.cost <= (filter.maxCost ?? Number.MAX_VALUE) &&
      (filter.maxCount ?? Number.MAX_VALUE) > selectedCards.length
    ) {
      return "select";
    }

    // If there is an active filter and the card doesn't match, it should default to "none" so it won't fall through.
    return "none";
  }

  if (choice && choice.$type === "categorize") {
    return "none";
  }

  if (choice && choice.$type === "arrange") {
    return "none";
  }

  if (choice && choice.$type === "react") {
    if (zone === "TempSelect") {
      if (cardInstanceId && selectedCards.includes(cardInstanceId)) {
        return "deselect";
      } else if (selectedCards.length === 0) {
        return "select";
      } else {
        return "none";
      }
    } else {
      return "none";
    }
  }

  if (turnState.activePlayerId !== playerId) {
    return "none";
  }

  switch (turnState.phase) {
    case "Action": {
      switch (zone) {
        case "Hand":
          return (resources.actions > 0 && card.types.includes("Action")) ||
            card.types.includes("Treasure")
            ? "play"
            : "none";
        default:
          return "none";
      }
    }
    case "BuyOrPlay": {
      switch (zone) {
        case "Hand":
          return card.types.includes("Treasure") ? "play" : "none";
        case "Supply":
          return resources.buys > 0 &&
            card.cost <= resources.coins &&
            state.gameState.kingdomState.supply.find(
              cps => cps.cardId === card.id && cps.count > 0,
            )
            ? "buy"
            : "none";
        default:
          return "none";
      }
    }
    case "Buy": {
      switch (zone) {
        case "Supply":
          return resources.buys > 0 &&
            card.cost <= resources.coins &&
            state.gameState.kingdomState.supply.find(
              cps => cps.cardId === card.id && cps.count > 0,
            )
            ? "buy"
            : "none";
        default:
          return "none";
      }
    }
    default:
      return "none";
  }
}
