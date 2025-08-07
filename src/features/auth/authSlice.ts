import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";

export type AuthState = {
  userInfo?: UserInfo;
};

export type UserInfo = {
  email: string;
  name: string;
};

const initialState: AuthState = {};

export const authSlice = createAppSlice({
  name: "auth",
  initialState: initialState,
  reducers: (create) => ({
    userLoggedIn: create.reducer((state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    }),
    userLoggedOut: create.reducer((state) => {
      state.userInfo = undefined;
    }),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectIsAuthenticated: (state) => !!state.userInfo,
    selectPlayerId: (state) => state.userInfo?.email,
    selectName: (state) => state.userInfo?.name,
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;

export const { selectIsAuthenticated, selectPlayerId, selectName } =
  authSlice.getSelectors();
