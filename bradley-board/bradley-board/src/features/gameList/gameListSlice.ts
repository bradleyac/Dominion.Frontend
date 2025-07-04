import { createEntityAdapter } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";

const gameListAdapter = createEntityAdapter();

const initialState = gameListAdapter.getInitialState({
  status: "idle",
})

export const gameListSlice = createAppSlice({
  name: "gameList",
  initialState,
  reducers: {

  },
  extraReducers: builder => {

  }
})