import { useContext, useEffect, useRef, useState } from "react";
import { SignalrConnector } from "./signalrConnector";
import { AuthContext, IAuthContext } from "react-oauth2-code-pkce";

export const useSignalr = () => {
  const { idToken } = useContext<IAuthContext>(AuthContext);
  const signalr = useRef<SignalrConnector>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (idToken && !signalr.current) {
      SignalrConnector.getInstance(idToken)
        .then((instance) => (signalr.current = instance))
        .then((_) => setReady(true));
    }
  }, [idToken]);

  useEffect(() => {
    signalr.current?.setIdToken(idToken);
  }, [idToken, ready]);

  return { ready: ready, signalr };
};
