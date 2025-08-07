import { useContext, useEffect } from "react";
import styles from "./Landing.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectIsAuthenticated,
  userLoggedIn,
  userLoggedOut,
} from "../auth/authSlice";
import { AuthContext, IAuthContext } from "react-oauth2-code-pkce";
import { useNavigate } from "react-router";

export const Landing = () => {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector((state) =>
    selectIsAuthenticated(state.auth),
  );
  const { logIn, logOut, idToken, idTokenData } =
    useContext<IAuthContext>(AuthContext);
  const email = (idTokenData as any)?.email;
  const name = (idTokenData as any)?.name;

  useEffect(() => {
    console.log([idToken, email, name]);
    if (idToken && email && name) {
      dispatch(userLoggedIn({ email, name }));
    }
  }, [idToken, email, name]);

  useEffect(() => {
    if (!idToken) {
      dispatch(userLoggedOut());
    }
  }, [idToken]);

  return (
    <div className={styles.landing}>
      <h1>Dominion</h1>
      {authStatus ? (
        <LogOutView logOut={logOut} name={name} />
      ) : (
        <LogInView logIn={logIn} />
      )}
    </div>
  );
};

const LogInView = ({ logIn }: { logIn: () => void }) => {
  return (
    <>
      <h2>Log in below to play now!</h2>
      <button onClick={(_) => logIn()}>Log In With Google</button>
    </>
  );
};

const LogOutView = ({ logOut, name }: { logOut: () => void; name: string }) => {
  const navigate = useNavigate();
  return (
    <>
      <h2>Welcome, {name}!</h2>
      <button onClick={() => navigate("/games")}>View Game List</button>
      <button onClick={(_) => logOut()}>Log Out</button>
    </>
  );
};
