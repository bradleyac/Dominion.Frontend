import { type PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";
import { CardData, CardFilter, CardZone } from "../card/cards";
import { getCardClickAction } from "./getCardClickAction";

export type ActiveGameState = {
  gameState: GameState;
  status: "idle" | "loading" | "failed";
  selectedCards: (number | string)[];
  categorizedCards: Record<string, string[]>;
  arrangedCards: CardInstance[];
};

export type GameState = {
  gameId: string;
  displayName: string;
  gameStarted: boolean;
  gameResult: GameResult | undefined;
  kingdomState: KingdomState;
  turnState: TurnState;
  log: LogState;
  me: FullPlayerState;
  opponents: PartialPlayerState[];
  playerIds: string[];
};

export type GameResult = {
  winners: string[];
  scores: Record<string, number>;
};

export type KingdomState = {
  supply: CardPileState[];
  trash: CardInstance[];
  reveal: CardInstance[];
};

export type TurnState = {
  currentTurnPlayerId: string;
  activePlayerId?: string;
  turn: number;
  phase: "Action" | "BuyOrPlay" | "Buy" | "Cleanup";
};

export type LogState = {
  messages: string[];
};

export type CardPileState = {
  cardId: number;
  count: number;
};

export type PlayerChoice = {
  $type: "select" | "arrange" | "categorize" | "react";
  id: string;
  prompt: string;
  isForced: boolean;
};

export type PlayerSelectChoice = PlayerChoice & {
  $type: "select";
  filter: CardFilter;
};

export type PlayerArrangeChoice = PlayerChoice & {
  $type: "arrange";
  cards: CardInstance[];
};

export type PlayerCategorizeChoice = PlayerChoice & {
  $type: "categorize";
  zoneToCategorize: CardZone;
  categories: string[];
  defaultCategory: string;
};

export type PlayerReactChoice = PlayerChoice & {
  $type: "react";
  effectReferences: EffectReference[];
  triggeringEffectId: string;
  triggeringEffectOwnerId: string;
};

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
};

export type CardInstance = {
  instanceId: string;
  cardId: number;
  location: CardZone;
};

export type EffectReference = {
  cardInstance: CardInstance;
  prompt: string;
};

export type PlayerResources = {
  actions: number;
  buys: number;
  coins: number;
  villagers: number;
  coffers: number;
  vps: number;
};

const initialState: ActiveGameState = {
  gameState: {
    gameId: "",
    displayName: "",
    gameStarted: false,
    gameResult: undefined,
    kingdomState: { supply: [], trash: [], reveal: [] },
    turnState: { currentTurnPlayerId: "", phase: "Action", turn: 0 },
    log: { messages: [] },
    me: {
      playerId: "",
      deckCount: 0,
      discard: [],
      hand: [],
      play: [],
      privateReveal: [],
      activeChoice: undefined,
      resources: {
        actions: 0,
        buys: 0,
        coffers: 0,
        coins: 0,
        villagers: 0,
        vps: 0,
      },
    },
    opponents: [],
    playerIds: [],
  },
  status: "idle",
  selectedCards: [],
  categorizedCards: {},
  arrangedCards: [],
};

export type CardCategorizations = Record<string, string>;

function groupByCategory(
  categorized: CardCategorizations,
): Record<string, string[]> {
  return Object.entries(categorized).reduce(
    (acc, [cardInstanceId, category]) => {
      if (!acc[category]) acc[category] = [];
      acc[category].push(cardInstanceId);
      return acc;
    },
    {} as Record<string, string[]>,
  );
}

export const gameSlice = createAppSlice({
  name: "game",
  initialState,
  reducers: (create) => ({
    toggleCard: create.reducer(
      (state, action: PayloadAction<number | string>) => {
        const card = action.payload;
        if (state.selectedCards.includes(card)) {
          state.selectedCards = state.selectedCards.filter((c) => c !== card);
        } else {
          state.selectedCards = [...state.selectedCards, card];
        }
      },
    ),
    cardCategorized: create.reducer(
      (state, action: PayloadAction<CardCategorizations>) => {
        state.categorizedCards = groupByCategory(action.payload);
      },
    ),
    cardsArranged: create.reducer(
      (state, action: PayloadAction<CardInstance[]>) => {
        state.arrangedCards = action.payload;
      },
    ),
    updateState: create.reducer((state, action: PayloadAction<GameState>) => {
      if (
        state.gameState.gameId !== "" &&
        action.payload.gameId !== state.gameState.gameId
      ) {
        return;
      }

      if (
        !action.payload.me.activeChoice ||
        state.gameState?.me.activeChoice?.id !==
        action.payload.me.activeChoice.id
      ) {
        state.selectedCards = [];
        state.categorizedCards = {};
        state.arrangedCards = [];
      }
      state.gameState = action.payload;
    }),
    clearGame: create.reducer((_) => {
      return initialState;
    }),
  }),
  selectors: {
    selectGameId: (state) => state.gameState.gameId,
    selectGameDisplayName: state => state.gameState.displayName,
    selectKingdomCards: (state) => state.gameState.kingdomState.supply,
    selectNonDefaultKingdomCards: (state) =>
      state.gameState.kingdomState.supply.filter(
        (c) => ![5, 6, 7, 8, 9, 10, 11].includes(c.cardId),
      ),
    selectPhase: (state) => state.gameState.turnState.phase,
    selectPlayerIds: state => state.gameState.playerIds,
    selectCurrentPlayer: (state) =>
      state.gameState!.turnState.currentTurnPlayerId,
    selectActivePlayer: (state) => state.gameState.turnState.activePlayerId,
    selectMyPlayerId: (state) => state.gameState.me.playerId,
    selectOpponents: (state) => state.gameState.opponents,
    selectStatus: (state) => state.status,
    selectTrash: (state) => state.gameState.kingdomState.trash,
    selectReveal: (state) => state.gameState.kingdomState.reveal,
    selectTurn: (state) => state.gameState.turnState.turn,
    selectMyName: (state) => state.gameState.me.playerId,
    selectHand: (state) => state.gameState.me.hand,
    selectDeckCount: (state) => state.gameState.me.deckCount,
    selectDiscard: (state) => state.gameState.me.discard,
    selectInPlay: (state) => state.gameState.me.play,
    selectPrivateReveal: (state) => state.gameState.me.privateReveal,
    selectResources: (state) => state.gameState.me.resources,
    selectLog: (state) => state.gameState.log.messages,
    selectCardClickAction: (
      state: ActiveGameState,
      card: CardData,
      zone: CardZone,
      cardInstanceId?: string,
    ) =>
      getCardClickAction(
        state,
        state.gameState.me.playerId,
        card,
        zone,
        state.gameState.me.resources,
        state.selectedCards,
        cardInstanceId,
        state.gameState.me.activeChoice,
      ),
    selectActiveChoice: (state) => state.gameState.me.activeChoice,
    selectSelectedCards: (state) => state.selectedCards,
    selectChoiceSatisfied: (state) => {
      if (!state.gameState.me.activeChoice) {
        return false;
      }
      if (state.gameState.me.activeChoice.$type === "select") {
        const { minCount, maxCount } = (
          state.gameState.me.activeChoice as PlayerSelectChoice
        ).filter;
        const count = state.selectedCards.length;
        return (
          count >= (minCount ?? 0) && count <= (maxCount ?? Number.MAX_VALUE)
        );
      } else if (state.gameState.me.activeChoice.$type === "categorize") {
        return true;
      } else if (state.gameState.me.activeChoice.$type === "arrange") {
        return true;
      } else if (state.gameState.me.activeChoice.$type === "react") {
        return state.selectedCards.length === 1;
      }
      return false; // For now, we only handle select choices
    },
    selectCategorizations: (state) => state.categorizedCards,
    selectArrangedCards: (state) => state.arrangedCards,
    selectGameResult: (state) => state.gameState.gameResult,
  },
});

// Action creators are generated for each case reducer function.
export const {
  updateState,
  toggleCard,
  cardCategorized,
  cardsArranged,
  clearGame,
} = gameSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
  selectGameId,
  selectGameDisplayName,
  selectKingdomCards,
  selectNonDefaultKingdomCards,
  selectPlayerIds,
  selectCurrentPlayer,
  selectActivePlayer,
  selectMyPlayerId,
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
  selectLog,
  selectCardClickAction,
  selectActiveChoice,
  selectSelectedCards,
  selectChoiceSatisfied,
  selectCategorizations,
  selectArrangedCards,
  selectGameResult,
} = gameSlice.selectors;
