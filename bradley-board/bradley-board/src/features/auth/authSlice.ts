import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";

export type AuthState = {
  status: "pending" | "authenticated" | "unauthenticated";
  userId?: string;
};

const initialState: AuthState = { status: "pending" };
// const initialState: AuthState = { status: "authenticated", userId: "andrew.charles.bradley@gmail.com" };

export const authSlice = createAppSlice({
  name: "auth",
  initialState: initialState,
  reducers: create => ({
    userLoggedIn: create.reducer((state, action: PayloadAction<string>) => {
      state.status = "authenticated";
      state.userId = action.payload;
    }),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectAuthStatus: state => state.status,
    selectUserId: state => state.userId,
  },
});

export const { userLoggedIn } = authSlice.actions;

export const { selectAuthStatus, selectUserId } = authSlice.getSelectors();
