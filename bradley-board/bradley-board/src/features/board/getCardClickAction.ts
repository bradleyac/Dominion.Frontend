import { BoardSliceState, PlayerState } from "./boardSlice";
import { ActionType, CardData, CardZone } from "../card/cards";

export function getCardClickAction
  (
    state: BoardSliceState,
    card: CardData,
    zone: CardZone,
    player: PlayerState,
    cardInstanceId?: number,
  ): ActionType {
  // This card is currently selected, so allow deselection
  if (state.selectedCards.filter(c => c.type === "data" && !cardInstanceId && c.id === card.id || c.type === "instance" && c.id === cardInstanceId).length > 0) {
    return "deselect";
  }

  if (state.activeFilter) {
    const filter = state.activeFilter;
    if (filter.from === zone) {
      if (!filter.types || card.types.filter(c => filter.types!.includes(c)).length > 0) {
        if ((!filter.minCost || card.cost >= filter.minCost) && (!filter.maxCost || card.cost <= filter.maxCost)) {
          if ((filter.maxCount ?? Number.MAX_VALUE) > state.selectedCards.length) {
            return "select";
          }
        }
      }
    }

    // If there is an active filter and the card doesn't match, it should default to "none" so it won't fall through.
    return "none";
  }

  switch (state.phase) {
    case "action": {
      switch (zone) {
        case "hand": return card.types.includes("action") || card.types.includes("treasure") ? "play" : "none";
        default: return "none";
      }
    }
    case "buyOrPlay": {
      switch (zone) {
        case "hand": return card.types.includes("treasure") ? "play" : "none";
        case "supply": return card.cost <= player.resources.coins ? "buy" : "none";
        default: return "none";
      }
    }
    case "buy": {
      switch (zone) {
        case "supply": return card.cost <= player.resources.coins ? "buy" : "none";
        default: return "none";
      }
    }
    default: return "none";
  }
}