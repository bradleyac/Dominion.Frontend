import { createEntityAdapter } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";

const cardsAdapter = createEntityAdapter();

const initialState = cardsAdapter.getInitialState({
  status: "idle",
})

export const cardsSlice = createAppSlice({
  name: "cards",
  initialState,
  reducers: {

  },
  extraReducers: builder => {

  }
})