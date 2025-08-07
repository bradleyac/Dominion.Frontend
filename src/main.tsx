import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
// import { App } from "./App";
import { store } from "./app/store";
import "./index.css";
import {
  AuthProvider,
  TAuthConfig,
  TRefreshTokenExpiredEvent,
} from "react-oauth2-code-pkce";
import { HashRouter, Route, Routes } from "react-router";
import { Landing } from "./features/landing/Landing";
import { GameList } from "./features/gameList/GameList";

// Google requires a client_secret here even for the authorization code flow with PKCE, which is specifically for public clients which cannot store secrets.
// Apparently this is fine, and we just need to include it. It's just not really a secret. PKCE is still what's making this secure. This is just for Google.
const authConfig: TAuthConfig = {
  clientId:
    "515082896158-m9qtkkba1tviq45ou8p5r83a86qoltgs.apps.googleusercontent.com",
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  redirectUri: `${window.location.protocol}//${window.location.host}`,
  scope: "openid profile email",
  extraTokenParameters: {
    client_secret: "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",
    access_type: "offline"
  },
  decodeToken: false,
  autoLogin: false,
  storage: "session",
  onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) => event.logIn(),
};

console.log(authConfig);

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  root.render(
    <StrictMode>
      <AuthProvider authConfig={authConfig}>
        <Provider store={store}>
          <HashRouter>
            <Routes>
              <Route index element={<Landing />} />
              <Route path="games" element={<GameList />} />
            </Routes>
          </HashRouter>
        </Provider>
      </AuthProvider>
    </StrictMode>,
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  );
}
