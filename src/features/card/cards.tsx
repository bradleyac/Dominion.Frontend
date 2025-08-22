import { EntityState } from "@reduxjs/toolkit";

export type CardType =
  | "Treasure"
  | "Action"
  | "Curse"
  | "Victory"
  | "Attack"
  | "Reaction";
export type ActionType = "select" | "deselect" | "buy" | "play" | "playThenBuy" | "none";
export type CardZone =
  | "Supply"
  | "Trash"
  | "Deck"
  | "Discard"
  | "Hand"
  | "Play"
  | "Reveal"
  | "PrivateReveal"
  | "TempSelect";

export type CardFilter = {
  id: string;
  types?: CardType[];
  minCost?: number;
  maxCost?: number;
  from: CardZone;
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

export const cards: EntityState<CardData, number> = {
  ids: [...Array(34).map((_, index) => index + 1)],
  entities: {
    1: {
      id: 1,
      name: "Village",
      imgSrc: "/card-images/village.jpg",
      cost: 3,
      types: ["Action"],
    },
    2: {
      id: 2,
      name: "Laboratory",
      imgSrc: "/card-images/laboratory.jpg",
      cost: 5,
      types: ["Action"],
    },
    3: {
      id: 3,
      name: "Festival",
      imgSrc: "/card-images/festival.jpg",
      cost: 5,
      types: ["Action"],
    },
    4: {
      id: 4,
      name: "Market",
      imgSrc: "/card-images/market.jpg",
      cost: 5,
      types: ["Action"],
    },
    5: {
      id: 5,
      name: "Copper",
      imgSrc: "/card-images/copper.jpg",
      cost: 0,
      types: ["Treasure"],
      area: "copper",
    },
    6: {
      id: 6,
      name: "Silver",
      imgSrc: "/card-images/silver.jpg",
      cost: 3,
      types: ["Treasure"],
      area: "silver",
    },
    7: {
      id: 7,
      name: "Gold",
      imgSrc: "/card-images/gold.jpg",
      cost: 6,
      types: ["Treasure"],
      area: "gold",
    },
    8: {
      id: 8,
      name: "Estate",
      imgSrc: "/card-images/estate.jpg",
      cost: 2,
      value: 1,
      types: ["Victory"],
      area: "estate",
    },
    9: {
      id: 9,
      name: "Duchy",
      imgSrc: "/card-images/duchy.jpg",
      cost: 5,
      value: 3,
      types: ["Victory"],
      area: "duchy",
    },
    10: {
      id: 10,
      name: "Province",
      imgSrc: "/card-images/province.jpg",
      cost: 8,
      value: 6,
      types: ["Victory"],
      area: "province",
    },
    11: {
      id: 11,
      name: "Curse",
      imgSrc: "/card-images/curse.jpg",
      cost: 0,
      value: -1,
      types: ["Curse"],
      area: "curse",
    },
    12: {
      id: 12,
      name: "Cellar",
      imgSrc: "/card-images/cellar.jpg",
      cost: 2,
      types: ["Action"],
    },
    13: {
      id: 13,
      name: "Artisan",
      imgSrc: "/card-images/artisan.jpg",
      cost: 6,
      types: ["Action"],
    },
    14: {
      id: 14,
      name: "Chapel",
      imgSrc: "/card-images/chapel.jpg",
      cost: 2,
      types: ["Action"],
    },
    15: {
      id: 15,
      name: "Witch",
      imgSrc: "/card-images/witch.jpg",
      cost: 5,
      types: ["Action", "Attack"],
    },
    16: {
      id: 16,
      name: "Workshop",
      imgSrc: "/card-images/workshop.jpg",
      cost: 3,
      types: ["Action"],
    },
    17: {
      id: 17,
      name: "Bandit",
      imgSrc: "/card-images/bandit.jpg",
      cost: 5,
      types: ["Action"],
    },
    18: {
      id: 18,
      name: "Forge",
      imgSrc: "/card-images/forge.jpg",
      cost: 7,
      types: ["Action"],
    },
    19: {
      id: 19,
      name: "Mine",
      imgSrc: "/card-images/mine.jpg",
      cost: 5,
      types: ["Action"],
    },
    20: {
      id: 20,
      name: "Remodel",
      imgSrc: "/card-images/remodel.jpg",
      cost: 4,
      types: ["Action"],
    },
    21: {
      id: 21,
      name: "Smithy",
      imgSrc: "/card-images/smithy.jpg",
      cost: 4,
      types: ["Action"],
    },
    22: {
      id: 22,
      name: "Vassal",
      imgSrc: "/card-images/vassal.jpg",
      cost: 3,
      types: ["Action"],
    },
    23: {
      id: 23,
      name: "Bureaucrat",
      imgSrc: "/card-images/bureaucrat.jpg",
      cost: 4,
      types: ["Action", "Attack"],
    },
    24: {
      id: 24,
      name: "Council Room",
      imgSrc: "/card-images/council-room.jpg",
      cost: 5,
      types: ["Action", "Attack"],
    },
    25: {
      id: 25,
      name: "Harbinger",
      imgSrc: "/card-images/harbinger.jpg",
      cost: 3,
      types: ["Action"],
    },
    26: {
      id: 26,
      name: "Militia",
      imgSrc: "/card-images/militia.jpg",
      cost: 4,
      types: ["Action", "Attack"],
    },
    27: {
      id: 27,
      name: "Moneylender",
      imgSrc: "/card-images/moneylender.jpg",
      cost: 4,
      types: ["Action"],
    },
    28: {
      id: 28,
      name: "Poacher",
      imgSrc: "/card-images/poacher.jpg",
      cost: 4,
      types: ["Action"],
    },
    29: {
      id: 29,
      name: "Sentry",
      imgSrc: "/card-images/sentry.jpg",
      cost: 5,
      types: ["Action"],
    },
    30: {
      id: 30,
      name: "Throne Room",
      imgSrc: "/card-images/throne-room.jpg",
      cost: 4,
      types: ["Action"],
    },
    31: {
      id: 31,
      name: "Gardens",
      imgSrc: "/card-images/gardens.jpg",
      cost: 4,
      types: ["Victory"],
    },
    32: {
      id: 32,
      name: "Library",
      imgSrc: "/card-images/library.jpg",
      cost: 5,
      types: ["Action"],
    },
    33: {
      id: 33,
      name: "Moat",
      imgSrc: "/card-images/moat.jpg",
      cost: 2,
      types: ["Action", "Reaction"],
    },
    34: {
      id: 34,
      name: "Merchant",
      imgSrc: "/card-images/merchant.jpg",
      cost: 3,
      types: ["Action"],
    },
    35: {
      id: 35,
      name: "Beggar",
      imgSrc: "/card-images/beggar.jpg",
      cost: 2,
      types: ["Action", "Reaction"],
    },
    36: {
      id: 36,
      name: "Trail",
      imgSrc: "/card-images/trail.jpg",
      cost: 4,
      types: ["Action", "Reaction"],
    },
    37: {
      id: 37,
      name: "Clerk",
      imgSrc: "/card-images/clerk.jpg",
      cost: 4,
      types: ["Action", "Reaction", "Attack"],
    },
  },
};

export const gridAreaMap: Record<number, string> = {
  5: "copper",
  6: "silver",
  7: "gold",
  8: "estate",
  9: "duchy",
  10: "province",
  11: "curse",
};
