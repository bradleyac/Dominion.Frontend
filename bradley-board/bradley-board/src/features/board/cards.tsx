export type CardType = "treasure" | "action" | "curse" | "victory";

export type CardZone = "supply" | "trash" | "deck" | "discard" | "hand";

export type CardFilter = {
    types?: CardType[];
    minCost?: number;
    maxCost?: number;
}

export type CardEffect = {
    who: "me" | "opps" | "all",
    what: "gain" | "move"
    filter?: CardFilter,
    from: CardZone,
    to: CardZone,
    count?: number,
}

export type CardResource = string | CardEffect;

export type CardData = {
    id: number;
    name: string;
    text: string;
    cost: number;
    value?: number;
    resources?: CardResource[];
    types: CardType[];
    area?: string; // Optional area for default kingdom cards
    pileCount?: number; // Optional pile count for default kingdom cards
    startingCount?: number; // Optional starting count for default kingdom cards
};

// # in a string resource stands for "the nost recent count of cards moved / gained"
// #card: Draw a number of cards equal to e.g. the number of cards you just chose to discard

export const deckCard: CardData = {
    "id": 0,
    "name": "Deck",
    "text": "",
    "cost": 0,
    "resources": [
    ],
    "types": [
    ]
}

export const cards: CardData[] = [
    {
        "id": 1,
        "name": "Village",
        "text": "+2 Actions +1 Card",
        "cost": 3,
        "resources": [
            "2action",
            "1card",
        ],
        "types": [
            "action"
        ]
    },
    {
        "id": 2,
        "name": "Laboratory",
        "text": "+2 Cards +1 Action",
        "cost": 5,
        "resources": [
            "2card",
            "1action",
        ],
        "types": [
            "action"
        ]
    },
    {
        "id": 3,
        "name": "Festival",
        "text": "+2 Actions +1 Buy +2 Coins",
        "cost": 5,
        "resources": [
            "2action",
            "1buy",
            "2coin",
        ],
        "types": [
            "action"
        ]
    },
    {
        "id": 4,
        "name": "Market",
        "text": "+1 Card +1 Action +1 Buy +1 Coin",
        "cost": 5,
        "resources": [
            "1card",
            "1action",
            "1buy",
            "1coin",
        ],
        "types": [
            "action"
        ]
    },
    {
        "id": 5,
        "name": "Copper",
        "text": "+1 Coin",
        "cost": 0,
        "resources": [
            "1coin"
        ],
        "types": [
            "treasure"
        ],
        "area": "copper",
        "startingCount": 7, // Starting count for Copper in a player's deck
        "pileCount": 60, // Total count for Copper in the game
    },
    {
        "id": 6,
        "name": "Silver",
        "text": "+2 Coins",
        "cost": 3,
        "resources": [
            "2coin"
        ],
        "types": [
            "treasure"
        ],
        "area": "silver",
        "pileCount": 40, // Total count for Silver in the game
    },
    {
        "id": 7,
        "name": "Gold",
        "text": "+3 Coins",
        "cost": 6,
        "resources": [
            "3coin"
        ],
        "types": [
            "treasure"
        ],
        "area": "gold",
        "pileCount": 30, // Total count for Gold in the game
    },
    {
        "id": 8,
        "name": "Estate",
        "text": "1 Victory Point",
        "cost": 2,
        "value": 1,
        "types": [
            "victory"
        ],
        "area": "estate",
        "startingCount": 3, // Starting count for Estate in a player's deck
        "pileCount": 8, // Total count for Estate in the game
    },
    {
        "id": 9,
        "name": "Duchy",
        "text": "3 Victory Points",
        "cost": 5,
        "value": 3,
        "types": [
            "victory"
        ],
        "area": "duchy",
        "pileCount": 8 // Total count for Duchy in the game
    },
    {
        "id": 10,
        "name": "Province",
        "text": "6 Victory Points",
        "cost": 8,
        "value": 6,
        "types": [
            "victory"
        ],
        "area": "province",
        "pileCount": 8 // Total count for Province in the game
    },
    {
        "id": 11,
        "name": "Curse",
        "text": "-1 Victory Point",
        "cost": 0,
        "value": -1,
        "types": [
            "curse"
        ],
        "area": "curse",
        "pileCount": 10 // Total count for Curse in the game
    },
    {
        "id": 12,
        "name": "Cellar",
        "text": "+1 Action. Discard any number of cards. +1 Card per card discarded",
        "cost": 1,
        "resources": [
            "1action",
            {
                "who": "me",
                "what": "move",
                "from": "hand",
                "to": "discard",
                "count": -4
            },
            "#card"
        ],
        "types": [
            "action"
        ]
    },
    {
        "id": 13,
        "name": "Card Six",
        "text": "+1 Action +1 Card",
        "cost": 1,
        "resources": [
            "1action",
            "1card"
        ],
        "types": [
            "action"
        ]
    },
    {
        "id": 14,
        "name": "Card Seven",
        "text": "+1 Action +1 Card",
        "cost": 1,
        "resources": [
            "1action",
            "1card"
        ],
        "types": [
            "action"
        ]
    },
    {
        "id": 15,
        "name": "Card Eight",
        "text": "+1 Action +1 Card",
        "cost": 1,
        "resources": [
            "1action",
            "1card"
        ],
        "types": [
            "action"
        ]
    },
    {
        "id": 16,
        "name": "Card Nine",
        "text": "+1 Action +1 Card",
        "cost": 1,
        "resources": [
            "1action",
            "1card"
        ],
        "types": [
            "action"
        ]
    },
    {
        "id": 17,
        "name": "Card Ten",
        "text": "+1 Action +1 Card",
        "cost": 1,
        "resources": [
            "1action",
            "1card"
        ],
        "types": [
            "action"
        ]
    }
]