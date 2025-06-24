import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"
import type { AppThunk } from "../../app/store"
import { cards, CardData } from "./cards"

let nextId = 1;

export type BoardSliceState = {
    kingdomCards: CardPileState[],
    player: PlayerState,
    trash: CardInstance[],
    turn: number,
    currentPlayer: number,
    phase: "action" | "buy" | "cleanup",
    status: "idle" | "loading" | "failed",
}

export type CardPileState = {
    card: CardData,
    remaining: number,
}

export type PlayerState = {
    hand: CardInstance[],
    deck: CardInstance[],
    discard: CardInstance[],
    play: CardInstance[],
    resources: PlayerResources
}

export type CardInstance = {
    id: number,
    card: CardData,
}

export type PlayerResources = {
    actions: number,
    buys: number,
    coins: number,
    villagers: number,
    coffers: number,
}

const initialState: BoardSliceState = {
    kingdomCards: cards.map(card => { return { card: card, remaining: card.pileCount ?? 10 } }),
    player: {
        hand: [],
        deck: [],
        discard: [],
        play: [],
        resources: {
            actions: 0,
            buys: 0,
            coins: 0,
            villagers: 0,
            coffers: 0,
        }
    },
    currentPlayer: 0,
    phase: "action",
    status: "idle",
    trash: [],
    turn: 0,
}

// If you are not using async thunks you can use the standalone `createSlice`.
export const boardSlice = createAppSlice({
    name: "board",
    initialState,
    reducers: create => ({
        startGame: create.reducer(state => {
            const startingCards = [...cards.filter(card => card.startingCount ?? 0 > 0).map(card => Array(card.startingCount).fill(0).map(i => ({ id: nextId++, card: card })))].flat()
            state.player.hand = startingCards.slice(0, 5);
            state.player.deck = startingCards.slice(5,);
            state.player.resources.actions = 1;
            state.player.resources.buys = 1;
            state.phase = "action";
            state.turn = 1;
        }),
        endTurn: create.reducer(onEndTurn),
        buyCard: create.reducer((state, action: PayloadAction<number>) => {
            const cardId = action.payload
            const cardPile = state.kingdomCards.find(pile => pile.card.id === cardId)
            if (cardPile && cardPile.remaining > 0 && state.player.resources.buys > 0 && state.player.resources.coins >= cardPile.card.cost) {
                cardPile.remaining -= 1;
                state.player.resources.buys -= 1;
                state.player.resources.coins -= cardPile.card.cost;
                const newCard = { id: nextId++, card: cardPile.card };
                state.player.discard.push(newCard);
            }
        }),
        playCard: create.reducer((state, action: PayloadAction<number>) => {
            const cardInstanceId = action.payload;
            const cardInstance = state.player.hand.find(card => card.id === cardInstanceId);
            if (cardInstance) {
                if (state.phase === "action" && !cardInstance.card.types.includes("action") && cardInstance.card.types.includes("treasure")) {
                    state.phase = "buy";
                }
                if (state.phase === "action" && cardInstance.card.types.includes("action") && state.player.resources.actions > 0) {
                    moveCardFromHandToPlay(cardInstance);
                    applyResources(state, cardInstance.card.resources ?? []);
                    state.player.resources.actions -= 1;
                }
                else if (state.phase === "buy" && cardInstance.card.types.includes("treasure")) {
                    moveCardFromHandToPlay(cardInstance);
                    applyResources(state, cardInstance.card.resources ?? []);
                }

                function moveCardFromHandToPlay(cardInstance: CardInstance): void {
                    state.player.play.push(cardInstance);
                    state.player.hand = state.player.hand.filter(c => c.id !== cardInstance.id);
                }
            }
        }),
        // // The function below is called a thunk and allows us to perform async logic. It
        // // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
        // // will call the thunk with the `dispatch` function as the first argument. Async
        // // code can then be executed and other actions can be dispatched. Thunks are
        // // typically used to make async requests.
        // incrementAsync: create.asyncThunk(
        //     async (amount: number) => {
        //         const response = await fetchCount(amount)
        //         // The value we return becomes the `fulfilled` action payload
        //         return response.data
        //     },
        //     {
        //         pending: state => {
        //             state.status = "loading"
        //         },
        //         fulfilled: (state, action) => {
        //             state.status = "idle"
        //             state.value += action.payload
        //         },
        //         rejected: state => {
        //             state.status = "failed"
        //         },
        //     },
        // ),
    }),
    // You can define your selectors here. These selectors receive the slice
    // state as their first argument.
    selectors: {
        selectKingdomCards: state => state.kingdomCards,
        selectCurrentPlayer: state => state.currentPlayer,
        selectPhase: state => state.phase,
        selectPlayer: state => state.player,
        selectStatus: state => state.status,
        selectTrash: state => state.trash,
        selectTurn: state => state.turn,
        selectHand: state => state.player.hand,
        selectDeck: state => state.player.deck,
        selectDiscard: state => state.player.discard,
        selectInPlay: state => state.player.play,
        selectResources: state => state.player.resources,
    },
})

// Action creators are generated for each case reducer function.
export const { buyCard, playCard, startGame, endTurn } = boardSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectKingdomCards, selectCurrentPlayer, selectPhase, selectPlayer, selectStatus, selectTrash, selectTurn, selectHand, selectDeck, selectDiscard, selectInPlay, selectResources } = boardSlice.selectors

class ResourceHandler {
    regex: RegExp;
    action: (results: RegExpExecArray, state: BoardSliceState) => void;
    constructor(regex: RegExp, action: (results: RegExpExecArray, state: BoardSliceState) => void) {
        this.regex = regex;
        this.action = action;
    }
}

const baseResourceHandler = new ResourceHandler(
    new RegExp("(?<count>\\d+)(?<resource>action|buy|card|coin)"),
    (results: RegExpExecArray, state: BoardSliceState) => {
        const count = Number(results.groups?.["count"]);
        const resource = results.groups?.["resource"];

        switch (resource) {
            case "coin": state.player.resources.coins += count;
                break;
            case "buy": state.player.resources.buys += count;
                break;
            case "action": state.player.resources.actions += count;
                break;
            case "card": state.player = drawCards(state.player, count);
                break;
        }
    }
);

const discardToDrawLimitNHandler = new ResourceHandler(
    new RegExp("discardToDrawLimit(?<limit>\\d+)"),
    (results: RegExpExecArray, state: BoardSliceState) => {
        const count = Number(results.groups?.["count"]);
        const resource = results.groups?.["resource"];

        switch (resource) {
            case "coin": state.player.resources.coins += count;
                break;
            case "buy": state.player.resources.buys += count;
                break;
            case "action": state.player.resources.actions += count;
                break;
            case "card": state.player = drawCards(state.player, count);
                break;
        }
    }
)

const resourceHandlers = [baseResourceHandler]

function applyResources(state: BoardSliceState, resourcesToApply: string[]): void {
    for (let unparsedResource of resourcesToApply) {
        for (let resourceHandler of resourceHandlers) {
            let results = resourceHandler.regex.exec(unparsedResource);
            if (results) {
                resourceHandler.action(results, state);
                break;
            }
        }

    }
}

function drawCards(playerState: PlayerState, count: number): PlayerState {
    let cardsDrawn = 0;

    while (cardsDrawn < count) {
        const { deck, discard, hand } = playerState;
        // Draw first card
        const card = deck.pop();

        if (card) {
            // If we got a card, add it to hand.
            hand.push(card);
            cardsDrawn += 1;
        }
        else {
            // Otherwise, shuffle discard into deck
            if (discard.length > 0) {
                playerState.deck = [...discard];
                playerState.discard = [];
            }
            else {
                // No discard to shuffle, just return. We don't get any more cards.
                break;
            }
        }
    }

    return playerState;
}

function onEndTurn(state: BoardSliceState): void {
    state.player.discard.push(...state.player.hand, ...state.player.play);
    state.player = { ...state.player, hand: [], play: [] }
    state.player.resources = { ...state.player.resources, actions: 1, buys: 1, coins: 0 }
    state.player = drawCards(state.player, 5);
    state.phase = "action";
    state.turn += 1;
}