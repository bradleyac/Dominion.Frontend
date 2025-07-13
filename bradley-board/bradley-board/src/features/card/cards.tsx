import { EntityState } from "@reduxjs/toolkit";

export type CardType = "Treasure" | "Action" | "Curse" | "Victory" | "Attack";
export type HighlightType = "buy" | "play" | "select" | "selected" | "discard";
export type ActionType = "select" | "deselect" | "buy" | "play" | "none";

export type CardZone =
  | "Supply"
  | "Trash"
  | "Deck"
  | "Discard"
  | "Hand"
  | "Play"
  | "Reveal"
  | "PrivateReveal";

export type CardFilter = {
  id: string;
  types?: CardType[];
  minCost?: number;
  maxCost?: number;
  from: CardZone;
  highlightType?: HighlightType;
  minCount?: number;
  maxCount?: number;
  cardId?: number;
  notId?: number;
};

export type CardData = {
  id: number;
  imgSrc: string;
  name: string;
  cost: number;
  value?: number;
  types: CardType[];
  area?: string; // Optional area for default kingdom cards
};

// # in a string resource stands for "the most recent count of cards moved / gained"
// #card: Draw a number of cards equal to e.g. the number of cards you just chose to discard

export const cards: EntityState<CardData, number> = { //{ ids: number[], entities: { [id: number]: CardData } } = {
  ids: [...Array(17).map((_, index) => index + 1)],
  entities: {
    1: {
      id: 1,
      name: "Village",
      imgSrc: "src/card-images/village.jpg",
      cost: 3,
      types: ["Action"],
    },
    2: {
      id: 2,
      name: "Laboratory",
      imgSrc: "src/card-images/laboratory.jpg",
      cost: 5,
      types: ["Action"],
    },
    3: {
      id: 3,
      name: "Festival",
      imgSrc: "src/card-images/festival.jpg",
      cost: 5,
      types: ["Action"],
    },
    4: {
      id: 4,
      name: "Market",
      imgSrc: "src/card-images/market.jpg",
      cost: 5,
      types: ["Action"],
    },
    5: {
      id: 5,
      name: "Copper",
      imgSrc: "src/card-images/copper.jpg",
      cost: 0,
      types: ["Treasure"],
      area: "copper",
    },
    6: {
      id: 6,
      name: "Silver",
      imgSrc: "src/card-images/silver.jpg",
      cost: 3,
      types: ["Treasure"],
      area: "silver",
    },
    7: {
      id: 7,
      name: "Gold",
      imgSrc: "src/card-images/gold.jpg",
      cost: 6,
      types: ["Treasure"],
      area: "gold",
    },
    8: {
      id: 8,
      name: "Estate",
      imgSrc: "src/card-images/estate.jpg",
      cost: 2,
      value: 1,
      types: ["Victory"],
      area: "estate",
    },
    9: {
      id: 9,
      name: "Duchy",
      imgSrc: "src/card-images/duchy.jpg",
      cost: 5,
      value: 3,
      types: ["Victory"],
      area: "duchy",
    },
    10: {
      id: 10,
      name: "Province",
      imgSrc: "src/card-images/province.jpg",
      cost: 8,
      value: 6,
      types: ["Victory"],
      area: "province",
    },
    11: {
      id: 11,
      name: "Curse",
      imgSrc: "src/card-images/curse.jpg",
      cost: 0,
      value: -1,
      types: ["Curse"],
      area: "curse",
    },
    12: {
      id: 12,
      name: "Cellar",
      imgSrc: "src/card-images/cellar.jpg",
      cost: 2,
      types: ["Action"],
    },
    13: {
      id: 13,
      name: "Artisan",
      imgSrc: "src/card-images/artisan.jpg",
      cost: 6,
      types: ["Action"],
    },
    14: {
      id: 14,
      name: "Chapel",
      imgSrc: "src/card-images/chapel.jpg",
      cost: 2,
      types: ["Action"],
    },
    15: {
      id: 15,
      name: "Witch",
      imgSrc: "src/card-images/witch.jpg",
      cost: 5,
      types: ["Action", "Attack"],
    },
    16: {
      id: 16,
      name: "Workshop",
      imgSrc: "src/card-images/workshop.jpg",
      cost: 3,
      types: ["Action"],
    },
    17: {
      id: 17,
      name: "Bandit",
      imgSrc: "src/card-images/bandit.jpg",
      cost: 5,
      types: ["Action"],
    },
    18: {
      id: 18,
      name: "Forge",
      imgSrc: "src/card-images/forge.jpg",
      cost: 7,
      types: ["Action"]
    }
  }
};

export const gridAreaMap: { [id: number]: string } = {
  5: "copper",
  6: "silver",
  7: "gold",
  8: "estate",
  9: "duchy",
  10: "province",
  11: "curse"
}