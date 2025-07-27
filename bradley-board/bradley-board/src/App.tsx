import { JSX, useEffect } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
  selectAuthStatus,
  userLoggedIn,
} from "./features/auth/authSlice";
import { GameList } from "./features/gameList/GameList";

export const App = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(state => selectAuthStatus(state.auth));

  useEffect(() => {
    if (authStatus === "pending") {
      fetch("/.auth/me").then(response =>
        response
          .json()
          .then(json =>
            dispatch(userLoggedIn(json.clientPrincipal.userDetails)),
          ),
      );
    }
  }, [authStatus]);


  return (
    <div className="App">
      <main className="App-main">
        {(authStatus === "pending" || authStatus === "unauthenticated")
          ? <p>Login required.</p>
          : <GameList />}
      </main>
    </div>
  );
};
