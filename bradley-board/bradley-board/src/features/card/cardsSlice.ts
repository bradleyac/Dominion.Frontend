import { createEntityAdapter } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";
import { CardData, cards } from "./cards";

const cardsAdapter = createEntityAdapter<CardData>();

// const initialState = cardsAdapter.getInitialState({
//   status: "idle",
// })

export const cardsSlice = createAppSlice({
  name: "cards",
  initialState: Object.assign({}, cards, { status: "idle" }),
  reducers: {
  },
})

export const {

} = cardsSlice.actions;

export const {
  selectAll: selectCards,
  selectById: selectCardById
} = cardsAdapter.getSelectors()