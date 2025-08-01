import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";

export type AuthState = {
  status: "pending" | "authenticated" | "unauthenticated";
  userInfo?: UserInfo;
};

export type UserInfo = {
  email: string;
  name: string;
  idToken: string;
}

const initialState: AuthState = { status: "unauthenticated" };
// const initialState: AuthState = { status: "authenticated", userId: "andrew.charles.bradley@gmail.com" };

export const authSlice = createAppSlice({
  name: "auth",
  initialState: initialState,
  reducers: create => ({
    userLoggedIn: create.reducer((state, action: PayloadAction<UserInfo>) => {
      state.status = "authenticated";
      state.userInfo = action.payload;
    }),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectAuthStatus: state => state.status,
    selectPlayerId: state => state.userInfo?.email,
    selectName: state => state.userInfo?.name,
    selectIdToken: state => state.userInfo?.idToken,
  },
});

export const { userLoggedIn } = authSlice.actions;

export const { selectAuthStatus, selectPlayerId, selectName, selectIdToken } = authSlice.getSelectors();
