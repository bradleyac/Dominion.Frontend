import { type PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";
import { CardData, CardFilter, CardZone } from "../card/cards";
import { getCardClickAction } from "./getCardClickAction";

export type BoardSliceState = {
  gameState: GameState;
  status: "idle" | "loading" | "failed";
  // activeFilter?: CardFilter;
  selectedCards: (number | string)[];
  // resolvingCard?: CardInstance & EffectState;
};

export type GameState = {
  gameId: string;
  kingdomState: KingdomState;
  turnState: TurnState;
  log: LogState;
  me: FullPlayerState;
  opponents: PartialPlayerState[];
}

export type KingdomState = {
  supply: CardPileState[];
  trash: CardInstance[];
  reveal: CardInstance[];
}

export type TurnState = {
  currentTurnPlayerId: string;
  activePlayerId?: string;
  turn: number;
  phase: "Action" | "BuyOrPlay" | "Buy" | "Cleanup";
}

export type LogState = {
  messages: string[];
}

// export type EffectState = {
//   effectIndex: number;
//   effectTargets: number[];
//   effectTargetIndex: number;
// };

export type CardPileState = {
  cardId: number;
  count: number;
};

export type PlayerChoice = {
  $type: "select" | "arrange" | "categorize",
  id: string;
  prompt: string;
  isForced: boolean;
}

export type PlayerSelectChoice = PlayerChoice & {
  $type: "select";
  filter: CardFilter;
}

export type PlayerArrangeChoice = PlayerChoice & {
  $type: "arrange";
  cards: CardInstance[];
}

export type PlayerCategorizeChoice = PlayerChoice & {
  $type: "categorize";
  cards: CardInstance[];
  categories: string[];
}

export type FullPlayerState = {
  playerId: string;
  hand: CardInstance[];
  deckCount: number;
  discard: CardInstance[];
  play: CardInstance[];
  privateReveal: CardInstance[];
  resources: PlayerResources;
  activeChoice: PlayerChoice | undefined;
};

export type PartialPlayerState = {
  playerId: string;
  handCount: number;
  deckCount: number;
  discardCount: number;
  discardFaceUpCardId?: number;
  play: CardInstance[];
  resources: PlayerResources;
}

export type CardInstance = {
  instanceId: string;
  cardId: number;
};

export type PlayerResources = {
  actions: number;
  buys: number;
  coins: number;
  villagers: number;
  coffers: number;
  vps: number;
};

const initialState: BoardSliceState = {
  gameState: {
    gameId: "",
    kingdomState: { supply: [], trash: [], reveal: [] },
    turnState: { currentTurnPlayerId: "", phase: "Action", turn: 0 },
    log: { messages: [] },
    me: {
      playerId: "", deckCount: 0, discard: [], hand: [], play: [], privateReveal: [], activeChoice: undefined, resources: {
        actions: 0,
        buys: 0,
        coffers: 0,
        coins: 0,
        villagers: 0,
        vps: 0,
      },
    },
    opponents: [],
  },
  status: "idle",
  selectedCards: [],
  // activeFilter: { from: "supply", highlightType: "select", minCost: 2, maxCost: 5 }
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const boardSlice = createAppSlice({
  name: "board",
  initialState,
  reducers: create => ({
    toggleCard: create.reducer((state, action: PayloadAction<number | string>) => {
      const card = action.payload;
      if (state.selectedCards.includes(card)) {
        state.selectedCards = state.selectedCards.filter(c => c !== card);
      }
      else {
        state.selectedCards = [...state.selectedCards, card];
      }
    }),
    updateState: create.reducer((state, action: PayloadAction<GameState>) => {
      if (!action.payload.me.activeChoice || (state.gameState.me.activeChoice?.id != action.payload.me.activeChoice.id)) {
        state.selectedCards = [];
      }
      state.gameState = action.payload;
    })
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectGameId: state => state.gameState.gameId,
    selectKingdomCards: state => state.gameState.kingdomState.supply,
    selectPhase: state => state.gameState.turnState.phase,
    selectCurrentPlayer: (state): string => state.gameState.turnState.currentTurnPlayerId,
    selectActivePlayer: state => state.gameState.turnState.activePlayerId,
    selectOpponents: state => state.gameState.opponents,
    selectStatus: state => state.status,
    selectTrash: state => state.gameState.kingdomState.trash,
    selectReveal: state => state.gameState.kingdomState.reveal,
    selectTurn: state => state.gameState.turnState.turn,
    selectMyName: state => state.gameState.me.playerId,
    selectHand: state => state.gameState.me.hand,
    selectDeckCount: state => state.gameState.me.deckCount,
    selectDiscard: state => state.gameState.me.discard,
    selectInPlay: state => state.gameState.me.play,
    selectPrivateReveal: state => state.gameState.me.privateReveal,
    selectResources: state => state.gameState.me.resources,
    // // TODO: How bad is this?
    // selectPlayerScore: state => {
    //   // const player = state.players[state.currentPlayer];
    //   // const sum = (arr: CardInstance[]): number => arr.reduce((prev, cur) => prev + (cur.card.value ?? 0), 0);
    //   // return player.resources.vps + sum(player.deck) + sum(player.discard) + sum(player.hand) + sum(player.play);
    //   return 0;
    // },
    selectLog: state => state.gameState.log.messages,
    selectCardClickAction: (state: BoardSliceState, card: CardData, zone: CardZone, cardInstanceId?: string) =>
      getCardClickAction(state, state.gameState.me.playerId, card, zone, state.gameState.me.resources, state.selectedCards, cardInstanceId, state.gameState.me.activeChoice),
    selectActiveChoice: state => state.gameState.me.activeChoice,
    selectSelectedCards: state => state.selectedCards,
    selectChoiceSatisfied: state => {
      if (!state.gameState.me.activeChoice) {
        return false;
      }
      if (state.gameState.me.activeChoice.$type === "select") {
        const { minCount, maxCount } = (state.gameState.me.activeChoice as PlayerSelectChoice).filter;
        const count = state.selectedCards.length;
        return count >= (minCount ?? 0) && count <= (maxCount ?? Number.MAX_VALUE);
      }
      return false; // For now, we only handle select choices
    }
  },
});

// Action creators are generated for each case reducer function.
export const { updateState, toggleCard } = boardSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
  selectGameId,
  selectKingdomCards,
  selectCurrentPlayer,
  selectActivePlayer,
  selectOpponents,
  selectPhase,
  selectMyName,
  selectStatus,
  selectTrash,
  selectReveal,
  selectTurn,
  selectHand,
  selectDeckCount,
  selectDiscard,
  selectInPlay,
  selectPrivateReveal,
  selectResources,
  // selectPlayerScore,
  selectLog,
  selectCardClickAction,
  selectActiveChoice,
  selectSelectedCards,
  selectChoiceSatisfied,
} = boardSlice.selectors;