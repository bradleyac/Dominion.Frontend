export type CardType = "treasure" | "action" | "curse" | "victory" | "attack";
export type HighlightType = "buy" | "play" | "select" | "selected" | "discard";
export type ActionType = "select" | "deselect" | "buy" | "play" | "none";

export type CardZone =
  | "supply"
  | "trash"
  | "deck"
  | "discard"
  | "hand"
  | "play";

export type CardFilter = {
  types?: CardType[];
  minCost?: number;
  maxCost?: number;
  from: CardZone;
  highlightType?: HighlightType,
  minCount?: number,
  maxCount?: number,
  cardId?: number,
};

export type SimpleEffect = {
  type: "simple",
  effect: string
};

export type MoveCardsEffect = {
  type: "move";
  who: "me" | "opps" | "all";
  what: "gain" | "move";
  filter?: CardFilter;
  to: CardZone;
};

export type CardEffect = SimpleEffect | MoveCardsEffect

export type CardData = {
  type: "data",
  id: number;
  imgSrc: string;
  name: string;
  text: string;
  cost: number;
  value?: number;
  resources: CardEffect[];
  types: CardType[];
  area?: string; // Optional area for default kingdom cards
  pileCount?: number; // Optional pile count for default kingdom cards
  startingCount?: number; // Optional starting count for default kingdom cards
};

// # in a string resource stands for "the most recent count of cards moved / gained"
// #card: Draw a number of cards equal to e.g. the number of cards you just chose to discard

export const cards: CardData[] = [
  {
    id: 1,
    type: "data",
    name: "Village",
    imgSrc: "src/card-images/village.jpg",
    text: "+2 Actions +1 Card",
    cost: 3,
    resources: [{ type: "simple", effect: "2action" }, { type: "simple", effect: "1card" }],
    types: ["action"],
  },
  {
    id: 2,
    type: "data",
    name: "Laboratory",
    imgSrc: "src/card-images/laboratory.jpg",
    text: "+2 Cards +1 Action",
    cost: 5,
    resources: [{ type: "simple", effect: "2card" }, { type: "simple", effect: "1action" }],
    types: ["action"],
  },
  {
    id: 3,
    type: "data",
    name: "Festival",
    imgSrc: "src/card-images/festival.jpg",
    text: "+2 Actions +1 Buy +2 Coins",
    cost: 5,
    resources: [{ type: "simple", effect: "2action" }, { type: "simple", effect: "1buy" }, { type: "simple", effect: "2coin" }],
    types: ["action"],
  },
  {
    id: 4,
    type: "data",
    name: "Market",
    imgSrc: "src/card-images/market.jpg",
    text: "+1 Card +1 Action +1 Buy +1 Coin",
    cost: 5,
    resources: [{ type: "simple", effect: "1card" }, { type: "simple", effect: "1action" }, { type: "simple", effect: "1buy" }, { type: "simple", effect: "1coin" }],
    types: ["action"],
  },
  {
    id: 5,
    type: "data",
    name: "Copper",
    imgSrc: "src/card-images/copper.jpg",
    text: "+1 Coin",
    cost: 0,
    resources: [{ type: "simple", effect: "1coin" }],
    types: ["treasure"],
    area: "copper",
    startingCount: 7, // Starting count for Copper in a player's deck
    pileCount: 60, // Total count for Copper in the game
  },
  {
    id: 6,
    type: "data",
    name: "Silver",
    imgSrc: "src/card-images/silver.jpg",
    text: "+2 Coins",
    cost: 3,
    resources: [{ type: "simple", effect: "2coin" }],
    types: ["treasure"],
    area: "silver",
    pileCount: 40, // Total count for Silver in the game
  },
  {
    id: 7,
    type: "data",
    name: "Gold",
    imgSrc: "src/card-images/gold.jpg",
    text: "+3 Coins",
    cost: 6,
    resources: [{ type: "simple", effect: "3coin" }],
    types: ["treasure"],
    area: "gold",
    pileCount: 30, // Total count for Gold in the game
  },
  {
    id: 8,
    type: "data",
    name: "Estate",
    imgSrc: "src/card-images/estate.jpg",
    text: "1 Victory Point",
    cost: 2,
    value: 1,
    types: ["victory"],
    area: "estate",
    startingCount: 3, // Starting count for Estate in a player's deck
    pileCount: 8, // Total count for Estate in the game
    resources: [],
  },
  {
    id: 9,
    type: "data",
    name: "Duchy",
    imgSrc: "src/card-images/duchy.jpg",
    text: "3 Victory Points",
    cost: 5,
    value: 3,
    types: ["victory"],
    area: "duchy",
    pileCount: 8, // Total count for Duchy in the game
    resources: [],
  },
  {
    id: 10,
    type: "data",
    name: "Province",
    imgSrc: "src/card-images/province.jpg",
    text: "6 Victory Points",
    cost: 8,
    value: 6,
    types: ["victory"],
    area: "province",
    pileCount: 8, // Total count for Province in the game
    resources: [],
  },
  {
    id: 11,
    type: "data",
    name: "Curse",
    imgSrc: "src/card-images/curse.jpg",
    text: "-1 Victory Point",
    cost: 0,
    value: -1,
    types: ["curse"],
    area: "curse",
    pileCount: 10, // Total count for Curse in the game
    resources: [],
  },
  {
    id: 12,
    type: "data",
    name: "Cellar",
    imgSrc: "src/card-images/cellar.jpg",
    text: "+1 Action. Discard any number of cards. +1 Card per card discarded",
    cost: 1,
    resources: [
      { type: "simple", effect: "1action" },
      {
        type: "move",
        who: "me",
        what: "move",
        filter: { from: "hand", highlightType: "discard" },
        to: "discard",
      },
      { type: "simple", effect: "4card" },
    ],
    types: ["action"],
  },
  {
    id: 13,
    type: "data",
    name: "Artisan",
    imgSrc: "src/card-images/artisan.jpg",
    text: "Gain a card to your hand costing up to 5. Put a card from your hand onto your deck.",
    cost: 6,
    resources: [
      {
        type: "move",
        who: "me",
        what: "gain",
        to: "hand",
        filter: { maxCost: 5, from: "supply", highlightType: "select", minCount: 1, maxCount: 1 }
      },
      {
        type: "move",
        who: "me",
        what: "move",
        to: "deck",
        filter: { from: "hand", highlightType: "select", minCount: 1, maxCount: 1 }
      }
    ],
    types: ["action"],
  },
  {
    id: 14,
    type: "data",
    name: "Chapel",
    imgSrc: "src/card-images/chapel.jpg",
    text: "Trash up to 4 cards from your hand.",
    cost: 2,
    resources: [{
      type: "move",
      to: "trash",
      what: "move",
      who: "me",
      filter: { maxCount: 4, from: "hand" }
    }],
    types: ["action"],
  },
  {
    id: 15,
    type: "data",
    name: "Witch",
    imgSrc: "src/card-images/witch.jpg",
    text: "+2 Cards. Each other player gains a Curse.",
    cost: 5,
    resources: [
      { type: "simple", effect: "2card" },
      {
        type: "move",
        to: "discard",
        what: "gain",
        who: "opps",
        filter: { from: "supply", cardId: 11 }
      }],
    types: ["action", "attack"],
  },
  {
    id: 16,
    type: "data",
    name: "Workshop",
    imgSrc: "src/card-images/workshop.jpg",
    text: "Gain a card costing up to 4.",
    cost: 3,
    resources: [{
      type: "move",
      to: "discard",
      who: "me",
      what: "gain",
      filter: { from: "supply", maxCost: 4, minCount: 1, maxCount: 1 }
    }],
    types: ["action"],
  },
  {
    id: 17,
    type: "data",
    name: "Card Ten",
    imgSrc: "src/card-images/harbinger.jpg",
    text: "+1 Action +1 Card",
    cost: 1,
    resources: [{ type: "simple", effect: "1action" }, { type: "simple", effect: "1card" }],
    types: ["action"],
  },
];
