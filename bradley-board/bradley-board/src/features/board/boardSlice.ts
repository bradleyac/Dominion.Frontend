import { type PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";
import { cards, CardData, CardEffect, CardFilter, CardZone, MoveCardsEffect, SimpleEffect } from "../card/cards";
import { getCardClickAction } from "./getCardClickAction";

let nextId = 1;

export type BoardSliceState = {
  kingdomCards: CardPileState[];
  players: PlayerState[];
  trash: CardInstance[];
  turn: number;
  currentPlayer: number;
  phase: "action" | "buyOrPlay" | "buy" | "cleanup";
  status: "idle" | "loading" | "failed";
  log: string[];
  activeFilter?: CardFilter;
  selectedCards: (CardData | CardInstance)[];
  resolvingCard?: CardInstance & EffectState
};

export type EffectState = {
  effectIndex: number,
  effectTargets: number[],
  effectTargetIndex: number,
};

export type CardPileState = {
  card: CardData;
  remaining: number;
};

export type PlayerState = {
  id: number;
  hand: CardInstance[];
  deck: CardInstance[];
  discard: CardInstance[];
  play: CardInstance[];
  resources: PlayerResources;
};

export type CardInstance = {
  type: "instance",
  id: number;
  card: CardData;
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
  kingdomCards: [],
  players: [
    {
      id: 0,
      deck: [],
      discard: [],
      hand: [],
      play: [],
      resources: {
        actions: 0,
        buys: 0,
        coffers: 0,
        coins: 0,
        villagers: 0,
        vps: 0,
      },
    },
  ],
  currentPlayer: 0,
  phase: "action",
  status: "idle",
  trash: [],
  turn: 0,
  log: [],
  selectedCards: [],
  // activeFilter: { from: "supply", highlightType: "select", minCost: 2, maxCost: 5 }
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const boardSlice = createAppSlice({
  name: "board",
  initialState,
  reducers: create => ({
    startGame: create.reducer((state, action: PayloadAction<number>) => {
      const playerCount = action.payload;
      onStartGame(state, playerCount);
    }),
    endTurn: create.reducer(onEndTurn),
    endActionPhase: create.reducer(state => { if (state.activeFilter || state.phase !== "action") return; state.phase = "buyOrPlay"; }),
    buyCard: create.reducer((state, action: PayloadAction<number>) => {
      if (state.activeFilter) return;
      const cardId = action.payload;
      const cardPile = state.kingdomCards.find(pile => pile.card.id === cardId);
      const player = selectCurrentPlayer({ board: state });
      if (
        cardPile &&
        cardPile.remaining > 0 &&
        player.resources.buys > 0 &&
        player.resources.coins >= cardPile.card.cost
      ) {
        state.phase = "buy";
        cardPile.remaining -= 1;
        player.resources.buys -= 1;
        player.resources.coins -= cardPile.card.cost;
        player.discard.push({ type: "instance", id: nextId++, card: cardPile.card });
        state.log.push(
          `Player ${state.currentPlayer} bought a ${cardPile.card.name}`,
        );
      }
      if (state.phase === "buy" && player.resources.buys === 0) {
        onEndTurn(state);
      }
    }),
    playCard: create.reducer((state, action: PayloadAction<number>) => {
      if (state.activeFilter) return;
      const cardInstanceId = action.payload;
      const player = selectCurrentPlayer({ board: state });
      const cardInstance = player.hand.find(card => card.id === cardInstanceId);
      if (cardInstance) {
        if (
          state.phase === "action" &&
          !cardInstance.card.types.includes("action") &&
          cardInstance.card.types.includes("treasure")
        ) {
          state.phase = "buyOrPlay";
        }
        if (
          state.phase === "action" &&
          cardInstance.card.types.includes("action") &&
          player.resources.actions > 0
        ) {
          moveCardFromHandToPlay(cardInstance);
          applyResources(state, cardInstance);
          player.resources.actions -= 1;
          if (player.resources.actions === 0) {
            state.phase = "buyOrPlay";
          }
        } else if (
          state.phase === "buyOrPlay" &&
          cardInstance.card.types.includes("treasure")
        ) {
          moveCardFromHandToPlay(cardInstance);
          applyResources(state, cardInstance);
        }

        function moveCardFromHandToPlay(cardInstance: CardInstance): void {
          player.play.push(cardInstance);
          player.hand = player.hand.filter(c => c.id !== cardInstance.id);
          state.log.push(
            `Player ${state.currentPlayer} played a ${cardInstance.card.name}`,
          );
        }
      }
    }),
    toggleCard: create.reducer((state, action: PayloadAction<CardData | CardInstance>) => {
      const card = action.payload;
      if (state.selectedCards.filter(c => c.type === card.type && c.id === card.id).length > 0) {
        state.selectedCards = state.selectedCards.filter(c => c.type !== card.type || c.id !== card.id);
      }
      else {
        state.selectedCards.push(card);
        if (state.selectedCards.length === 1 && state.resolvingCard && state.activeFilter?.maxCount === 1) {
          finishCurrentEffect(state, state.resolvingCard, true);
        }
      }
    }),
    submitSelectedCards: create.reducer(state => {
      if (state.resolvingCard) {
        finishCurrentEffect(state, state.resolvingCard, true);
      }
    }),
    updateState: create.reducer((state, action: PayloadAction<any>) => {
      console.log(action.payload);
      // const { kingdomState, log, me, opponents, turnState } = action.payload;
      // state.kingdomCards = kingdomState.supply.map(cardPile => {
      //   return ({

      //   });
      // })
    })
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectKingdomCards: state => state.kingdomCards,
    selectPhase: state => state.phase,
    selectCurrentPlayer: (state): PlayerState => state.players[state.currentPlayer],//state.resolvingCard ? state.players[state.resolvingCard.effectTargets[state.resolvingCard.effectTargetIndex]] : state.players[state.currentPlayer],
    selectCurrentPlayerName: state => `Player ${state.currentPlayer}`,
    selectStatus: state => state.status,
    selectTrash: state => state.trash,
    selectTurn: state => state.turn,
    selectHand: state => selectCurrentPlayer({ board: state }).hand,
    selectDeck: state => selectCurrentPlayer({ board: state }).deck,
    selectDiscard: state => selectCurrentPlayer({ board: state }).discard,
    selectInPlay: state => selectCurrentPlayer({ board: state }).play,
    selectResources: state => selectCurrentPlayer({ board: state }).resources,
    // TODO: How bad is this?
    selectPlayerScore: state => {
      const player = state.players[state.currentPlayer];
      const sum = (arr: CardInstance[]): number => arr.reduce((prev, cur) => prev + (cur.card.value ?? 0), 0);
      return player.resources.vps + sum(player.deck) + sum(player.discard) + sum(player.hand) + sum(player.play);
    },
    selectLog: state => state.log,
    selectCardClickAction: getCardClickAction,
    selectActiveFilter: state => state.activeFilter,
    selectSelectedCards: state => state.selectedCards,
    selectFilterSatisfied: state => {
      if (!state.activeFilter) {
        return false;
      }
      const { minCount, maxCount } = state.activeFilter;
      const count = state.selectedCards.length;
      return count >= (minCount ?? 0) && count <= (maxCount ?? Number.MAX_VALUE);
    }
  },
});

// Action creators are generated for each case reducer function.
export const { buyCard, playCard, startGame, endTurn, toggleCard, endActionPhase, submitSelectedCards, updateState } = boardSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
  selectKingdomCards,
  selectCurrentPlayer,
  selectPhase,
  selectCurrentPlayerName,
  selectStatus,
  selectTrash,
  selectTurn,
  selectHand,
  selectDeck,
  selectDiscard,
  selectInPlay,
  selectResources,
  selectPlayerScore,
  selectLog,
  selectCardClickAction,
  selectActiveFilter,
  selectSelectedCards,
  selectFilterSatisfied,
} = boardSlice.selectors;

class ResourceHandler {
  canHandle: (res: CardEffect) => boolean;
  handleResource: (
    cardInstance: CardInstance,
    res: CardEffect,
    index: number,
    state: BoardSliceState,
  ) => boolean;
  constructor(
    canHandle: (res: CardEffect) => boolean,
    action: (
      cardInstance: CardInstance,
      res: CardEffect,
      index: number,
      state: BoardSliceState,
    ) => boolean,
  ) {
    this.canHandle = canHandle;
    this.handleResource = action;
  }
}

const ResourceRegex = new RegExp(
  "(?<count>\\d+)(?<resource>action|buy|card|coin)",
);

const baseResourceHandler = new ResourceHandler(
  (res: CardEffect): boolean =>
    res.type === "simple",
  (
    cardInstance: CardInstance,
    res: CardEffect,
    index: number,
    state: BoardSliceState,
  ) => {
    const results = ResourceRegex.exec((res as SimpleEffect).effect);
    if (results) {
      const count = Number(results.groups?.["count"]);
      const resource = results.groups?.["resource"];
      const player = selectCurrentPlayer({ board: state });

      switch (resource) {
        case "coin":
          player.resources.coins += count;
          break;
        case "buy":
          player.resources.buys += count;
          break;
        case "action":
          player.resources.actions += count;
          break;
        case "card":
          drawCards(player, count);
          break;
      }
    }
    return true;
  },
);

const chooseCardResourceHandler = new ResourceHandler(
  (res: CardEffect): boolean => res.type === "move",
  (
    cardInstance: CardInstance,
    res: CardEffect,
    index: number,
    state: BoardSliceState,
  ) => {
    if (state.resolvingCard) {
      const targets = state.resolvingCard.effectTargets;
      const nextTarget = state.resolvingCard.effectTargetIndex + 1;
      const specificCard = state.activeFilter!.cardId

      if (nextTarget >= targets.length) {
        state.resolvingCard = { ...state.resolvingCard, effectIndex: state.resolvingCard.effectIndex + 1, effectTargets: [], effectTargetIndex: -1 }
        return true;
      }
      else {
        state.resolvingCard = { ...state.resolvingCard, effectTargetIndex: nextTarget };

        if (specificCard) {
          state.selectedCards = [state.kingdomCards.find(kc => kc.card.id === specificCard)!.card];
          finishCurrentEffect(state, cardInstance, false);
          return true;
        }
        else {
          state.selectedCards = [];
          return false;
        }
      }
    }
    else {
      const effect = res as MoveCardsEffect;
      const targets = effect.who === "me" ? [state.currentPlayer]
        : effect.who === "all" ? rotate(state.players.map(p => p.id), state.currentPlayer)
          : effect.who === "opps" ? rotate(state.players.map(p => p.id), state.currentPlayer).filter(id => id !== state.currentPlayer)
            : [];
      state.resolvingCard = { ...cardInstance, effectIndex: index, effectTargets: targets, effectTargetIndex: 0 };
      state.activeFilter = effect.filter;

      const specificCard = state.activeFilter!.cardId

      if (specificCard) {
        state.selectedCards = [state.kingdomCards.find(kc => kc.card.id === specificCard)!.card];
        finishCurrentEffect(state, cardInstance, false);
        return true;
      }
      else {
        state.selectedCards = [];
        return false;
      }
    }
  }
)

function rotate(array: any[], amountToRotate: number) {
  amountToRotate = amountToRotate % array.length;
  return [...array.slice(amountToRotate), ...array.slice(0, amountToRotate)];
}

const resourceHandlers = [baseResourceHandler, chooseCardResourceHandler];

function applyResources(
  state: BoardSliceState,
  cardInstance: CardInstance,
): void {
  for (let [index, resource] of cardInstance.card.resources.entries()) {
    for (let resourceHandler of resourceHandlers) {
      if (resourceHandler.canHandle(resource)) {
        const keepGoing = resourceHandler.handleResource(cardInstance, resource, index, state);
        if (!keepGoing) {
          return;
        }
        else {
          break;
        }
      }
    }
  }
  delete state.resolvingCard;
  delete state.activeFilter;
}

function resumeApplyingResources(
  state: BoardSliceState,
  cardInstance: CardInstance,
): void {
  for (let [index, resource] of [...cardInstance.card.resources.entries()].slice(state.resolvingCard!.effectIndex)) {
    for (let resourceHandler of resourceHandlers) {
      if (resourceHandler.canHandle(resource)) {
        const keepGoing = resourceHandler.handleResource(cardInstance, resource, index, state);
        if (!keepGoing) {
          return;
        }
        else {
          break;
        }
      }
    }
  }
  delete state.resolvingCard;
  delete state.activeFilter;
}

function finishCurrentEffect(
  state: BoardSliceState,
  cardInstance: CardInstance,
  resumeAfter: boolean,
): void {
  const currentEffect = cardInstance.card.resources[state.resolvingCard!.effectIndex] as MoveCardsEffect;
  const targetPlayer = state.resolvingCard!.effectTargets[state.resolvingCard!.effectTargetIndex];
  const player = state.players[targetPlayer];
  // currentEffect.what; TODO: "gain" | "move"

  moveCards(state, player, currentEffect.filter!.from, currentEffect.to);

  state.selectedCards = [];

  if (resumeAfter) {
    resumeApplyingResources(state, cardInstance);
  }
}

function moveCards(state: BoardSliceState, player: PlayerState, from: CardZone, to: CardZone) {
  const selectedCardIds = state.selectedCards.map(c => c.id);
  switch (from) {
    case "deck": player.deck = player.deck.filter(card => !selectedCardIds.includes(card.id)); break;
    case "discard": player.discard = player.discard.filter(card => !selectedCardIds.includes(card.id)); break;
    case "hand": player.hand = player.hand.filter(card => !selectedCardIds.includes(card.id)); break;
    case "trash": state.trash = state.trash.filter(card => !selectedCardIds.includes(card.id)); break;
    case "play": player.play = player.play.filter(card => !selectedCardIds.includes(card.id)); break;
    case "supply": {
      for (let id of selectedCardIds) {
        const cardPile = state.kingdomCards.find(c => c.card.id === id && c.remaining > 0);
        if (cardPile) {
          cardPile.remaining -= 1;
        }
        else {
          throw "Card pile is empty.";
        }
      }
      break;
    }
    default: throw "what??";
  }
  switch (to) {
    case "supply": {
      for (let card of state.selectedCards) {
        const cardId = card.type === "data" ? (card as CardData).id : card.card.id;
        state.kingdomCards.find(c => c.card.id === cardId)!.remaining += 1;
      }
      break;
    }
    case "deck": player.deck.push(...state.selectedCards.map(makeInstance)); break;
    case "discard": player.discard.push(...state.selectedCards.map(makeInstance)); break;
    case "hand": player.hand.push(...state.selectedCards.map(makeInstance)); break;
    case "play": player.play.push(...state.selectedCards.map(makeInstance)); break;
    case "trash": state.trash.push(...state.selectedCards.map(makeInstance)); break;
  }
}

function makeInstance(card: CardData | CardInstance): CardInstance {
  return card.type === "instance" ? card : { type: "instance", card: card, id: nextId++ };
}

function drawCards(playerState: PlayerState, count: number): void {
  let cardsDrawn = 0;

  while (cardsDrawn < count) {
    const { deck, discard, hand } = playerState;
    // Draw first card
    const card = deck.pop();

    if (card) {
      // If we got a card, add it to hand.
      hand.push(card);
      cardsDrawn += 1;
    } else {
      // Otherwise, shuffle discard into deck
      if (discard.length > 0) {
        shuffleDeck(playerState);
      } else {
        // No discard to shuffle, just return. We don't get any more cards.
        break;
      }
    }
  }
}

function onEndTurn(state: BoardSliceState): void {
  if (checkForGameEnd(state.kingdomCards)) {
    onEndGame(state);
    return;
  }
  let player = selectCurrentPlayer({ board: state });
  player.discard.push(...player.hand, ...player.play);
  player = { ...player, hand: [], play: [] };
  player.resources = { ...player.resources, actions: 1, buys: 1, coins: 0 };
  drawCards(player, 5);
  state.log.push(
    `Player ${state.currentPlayer} ended their turn and drew ${player.hand.map(card => card.card.name).join(", ")}`,
  );
  state.players[state.currentPlayer] = player;
  state.phase = "action";
  state.currentPlayer = (state.currentPlayer + 1) % state.players.length;
  if (state.currentPlayer == 0) {
    state.turn += 1;
  }
  player = selectCurrentPlayer({ board: state });
  player.resources = { ...player.resources, actions: 1, buys: 1, coins: 0 };
  state.log.push(`Player ${state.currentPlayer}'s turn (${state.turn})`);
}

function onEndGame(state: BoardSliceState): void {
  const playersWithPoints = state.players.map(player => ({
    id: player.id,
    points: countPlayerPoints(player),
  }));
  const highestPoints = Math.max(...playersWithPoints.map(p => p.points));
  let tiedPlayers = playersWithPoints.filter(
    player => player.points === highestPoints,
  );
  let winner = 0;
  if (tiedPlayers.length === 1) {
    winner = tiedPlayers[0].id;
  } else {
    const tiedPlayersWithFewerTurnsPlayed = tiedPlayers.filter(
      p => p.id > state.currentPlayer,
    );
    if (tiedPlayersWithFewerTurnsPlayed.length === 1) {
      winner = tiedPlayersWithFewerTurnsPlayed[0].id;
    } else if (tiedPlayersWithFewerTurnsPlayed.length > 1) {
      tiedPlayers = tiedPlayersWithFewerTurnsPlayed;
    }
  }

  if (winner === 0) {
    const playersString = `${tiedPlayers
      .slice(0, -1)
      .map(player => player.id)
      .join(", ")} and ${tiedPlayers.at(-1)!.id}`;
    state.log.push(`Game over! Players ${playersString} tie!`);
  } else {
    state.log.push(`Game over! Player ${winner} wins!`);
  }

  onStartGame(state, 2);

  function countPlayerPoints(player: PlayerState): number {
    const allCards = [
      ...player.deck,
      ...player.discard,
      ...player.hand,
      ...player.play,
    ];
    return (
      allCards.reduce((acc, current) => acc + (current.card.value ?? 0), 0) +
      player.resources.vps
    );
  }
}

function onStartGame(state: BoardSliceState, playerCount: number): void {
  state.players = Array.from({ length: playerCount }, (_, i) => {
    const startingCards = [
      ...cards
        .filter(card => card.startingCount ?? 0 > 0)
        .map(card =>
          Array(card.startingCount)
            .fill(0)
            .map(() => ({ type: "instance", id: nextId++, card: card } as const)),
        ),
    ].flat();

    shuffleArray(startingCards);

    return {
      id: i,
      hand: startingCards.slice(0, 5),
      deck: startingCards.slice(5),
      discard: [],
      play: [],
      resources: {
        actions: i === 0 ? 1 : 0,
        buys: i === 0 ? 1 : 0,
        coffers: 0,
        coins: 0,
        villagers: 0,
        vps: 0,
      },
    };
  });

  state.kingdomCards = cards.map(card => {
    return { card: card, remaining: card.pileCount ?? 10 };
  });
  state.phase = "action";
  state.turn = 1;
  state.currentPlayer = 0;
  state.log.push("Game Started");
}

function checkForGameEnd(kingdomCards: CardPileState[]): boolean {
  const provincesStack = kingdomCards.find(kc => kc.card.id === 10);
  if (provincesStack!.remaining === 0) {
    return true;
  }

  return kingdomCards.filter(kc => kc.remaining === 0).length >= 3;
}

function shuffleDeck(playerState: PlayerState): void {
  playerState.deck = [...playerState.deck, ...playerState.discard];
  playerState.discard = [];
  shuffleArray(playerState.deck);
}

function shuffleArray(array: any[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
