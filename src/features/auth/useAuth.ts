import { useContext } from "react";
import { AuthContext, IAuthContext } from "react-oauth2-code-pkce";

export const useAuth = () => {
  const { logIn, logOut, idToken } =
    useContext<IAuthContext>(AuthContext);

  return { logIn, logOut, idToken };
};
