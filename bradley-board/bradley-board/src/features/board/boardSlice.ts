import type { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";
import type { AppThunk } from "../../app/store";
import { cards, CardData, CardResource, CardEffect } from "./cards";
import { ChoosableCard } from "./stateMachine";

let nextId = 1;

export type BoardSliceState = {
  kingdomCards: CardPileState[];
  players: PlayerState[];
  trash: CardInstance[];
  turn: number;
  currentPlayer: number;
  phase: "action" | "buy" | "cleanup";
  status: "idle" | "loading" | "failed";
  log: string[];
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
    buyCard: create.reducer((state, action: PayloadAction<number>) => {
      const cardId = action.payload;
      const cardPile = state.kingdomCards.find(pile => pile.card.id === cardId);
      const player = state.players[state.currentPlayer];
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
        const newCard = { id: nextId++, card: cardPile.card };
        player.discard.push(newCard);
        state.log.push(
          `Player ${state.currentPlayer} bought a ${cardPile.card.name}`,
        );
      }
      if (state.phase === "buy" && player.resources.buys === 0) {
        onEndTurn(state);
      }
    }),
    playCard: create.reducer((state, action: PayloadAction<number>) => {
      const cardInstanceId = action.payload;
      const player = state.players[state.currentPlayer];
      const cardInstance = player.hand.find(card => card.id === cardInstanceId);
      if (cardInstance) {
        if (
          state.phase === "action" &&
          !cardInstance.card.types.includes("action") &&
          cardInstance.card.types.includes("treasure")
        ) {
          state.phase = "buy";
        }
        if (
          state.phase === "action" &&
          cardInstance.card.types.includes("action") &&
          player.resources.actions > 0
        ) {
          moveCardFromHandToPlay(cardInstance);
          applyResources(state, cardInstance);
          player.resources.actions -= 1;
        } else if (
          state.phase === "buy" &&
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
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectKingdomCards: state => state.kingdomCards,
    selectPhase: state => state.phase,
    selectCurrentPlayer: state => state.players[state.currentPlayer],
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
      const player = selectCurrentPlayer({ board: state });
      return player.deck
        .concat(player.hand)
        .concat(player.discard)
        .concat(player.play)
        .reduce(
          (prev, cur) => prev + (cur.card.value ?? 0),
          player.resources.vps,
        );
    },
    selectLog: state => state.log,
  },
});

// Action creators are generated for each case reducer function.
export const { buyCard, playCard, startGame, endTurn } = boardSlice.actions;

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
} = boardSlice.selectors;

class ResourceHandler {
  canHandle: (res: CardResource) => boolean;
  handleResource: (
    cardInstance: CardInstance,
    res: CardResource,
    index: number,
    state: BoardSliceState,
  ) => void;
  constructor(
    canHandle: (res: CardResource) => boolean,
    action: (
      cardInstance: CardInstance,
      res: CardResource,
      index: number,
      state: BoardSliceState,
    ) => void,
  ) {
    this.canHandle = canHandle;
    this.handleResource = action;
  }
}

const ResourceRegex = new RegExp(
  "(?<count>\\d+)(?<resource>action|buy|card|coin)",
);

const baseResourceHandler = new ResourceHandler(
  (res: CardResource): boolean =>
    typeof res === "string" && ResourceRegex.test(res as string),
  (
    cardInstance: CardInstance,
    res: CardResource,
    index: number,
    state: BoardSliceState,
  ) => {
    const results = ResourceRegex.exec(res as string);
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
  },
);

const resourceHandlers = [baseResourceHandler];

function applyResources(
  state: BoardSliceState,
  cardInstance: CardInstance,
): void {
  for (let [index, resource] of cardInstance.card.resources?.entries() ?? []) {
    for (let resourceHandler of resourceHandlers) {
      if (resourceHandler.canHandle(resource)) {
        resourceHandler.handleResource(cardInstance, resource, index, state);
        break;
      }
    }
  }
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
      .join(", ")} and ${tiedPlayers.slice(-1)[0].id}`;
    state.log.push(`Game over! Players ${playersString} tie!}`);
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
            .map(() => ({ id: nextId++, card: card })),
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
