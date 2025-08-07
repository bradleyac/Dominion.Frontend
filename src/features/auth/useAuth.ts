import { useContext, useEffect } from "react";
import { AuthContext, IAuthContext } from "react-oauth2-code-pkce";
import { useAppDispatch } from "../../app/hooks";
import { userLoggedIn, userLoggedOut } from "./authSlice";

export const useAuth = () => {
  const { logIn, logOut, idToken, idTokenData } =
    useContext<IAuthContext>(AuthContext);

  return { logIn, logOut, idToken };
};
