import { assign, setup } from "xstate";
import { CardInstance } from "./boardSlice";
import { CardData, CardFilter, CardZone } from "./cards";

export type ChoosableCard =
  | (CardData & {
      type: "data";
    })
  | (CardInstance & {
      type: "instance";
    });

type ChooseCardsContext = { count: number; zone: CardZone; filter: CardFilter };

export const chooseCardsMachine = setup({
  types: {
    context: {} as {
      chosen: ChoosableCard[];
      ctx?: ChooseCardsContext;
    },
    events: {} as
      | {
          type: "cards.chosen";
          chosen: ChoosableCard[];
        }
      | {
          type: "cards.beginChoosing";
          ctx: ChooseCardsContext;
        },
    output: {} as {
      chosen: ChoosableCard[];
    },
  },
  actions: {
    changeCard: (_, params: { ctx: ChooseCardsContext }) => {
      assign({
        ctx: params.ctx,
      });
    },
    choose: (_, params: { chosen: ChoosableCard[] }) => {
      assign({
        chosen: params.chosen,
      });
    },
  },
}).createMachine({
  id: "chooseCards",
  context: { chosen: [] },
  initial: "Choosing",
  states: {
    Idle: {
      on: {
        "cards.beginChoosing": {
          target: "Choosing",
          actions: {
            type: "changeCard",
            params: ({ event }) => ({
              ctx: event.ctx,
            }),
          },
        },
      },
    },
    Choosing: {
      on: {
        "cards.chosen": {
          target: "Chosen",
          actions: {
            type: "choose",
            params: ({ event }) => ({
              chosen: event.chosen,
            }),
          },
        },
      },
    },
    Chosen: {
      type: "final",
      output: ({ context }) => ({
        chosen: context.chosen,
      }),
    },
  },
});
