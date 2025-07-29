import { JSX, useContext, useEffect } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
  selectAuthStatus,
  userLoggedIn,
} from "./features/auth/authSlice";
import { GameList } from "./features/gameList/GameList";
import { AuthContext, IAuthContext } from "react-oauth2-code-pkce";

export const App = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(state => selectAuthStatus(state.auth));
  const { logIn, token, idToken, idTokenData } = useContext<IAuthContext>(AuthContext);
  const email = (idTokenData as any)?.email;
  const name = (idTokenData as any)?.name;

  useEffect(() => {
    if (idToken && email && name) {
      dispatch(userLoggedIn({ idToken, email, name }))
    }
  }, [idToken, email, name])

  return (
    <div className="App">
      <main className="App-main">
        {(authStatus === "pending" || authStatus === "unauthenticated")
          ? <><button onClick={_ => logIn()}>Log In With Google</button></>
          : <GameList />
        }
      </main>
    </div>
  );
};
