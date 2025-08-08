import { useContext, useEffect } from "react";
import styles from "./Layout.module.css";
import { selectIsAuthenticated, selectPlayerId, userLoggedOut } from "../auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Outlet, useNavigate } from "react-router";
import { AuthContext, IAuthContext } from "react-oauth2-code-pkce";

export const Layout = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("navigating...");
      navigate("/");
    }
  }, [isAuthenticated]);

  return <div className={styles.container}>
    <UserChrome />
    <div className={styles.content}>
      <Outlet />
    </div>
  </div>
}

const UserChrome = () => {
  const { logOut } = useContext<IAuthContext>(AuthContext);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const playerId = useAppSelector(selectPlayerId);
  const dispatch = useAppDispatch();

  function doLogOut() {
    logOut();
    dispatch(userLoggedOut());
  }

  if (isAuthenticated) {
    return <div className={styles.userChrome}>{playerId}<button title="Log Out" className="icon iconLogOut" onClick={doLogOut}></button></div>
  }
  else {
    return <div className={styles.userChrome}><p>Logged out.</p></div>
  }
}