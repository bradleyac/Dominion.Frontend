import "./App.css";
import { Board } from "./features/board/Board";
import { GameList } from "./features/gameList/GameList";
import { Log } from "./features/log/Log";
import { PlayArea } from "./features/playArea/PlayArea";
import { Player } from "./features/player/Player";
import { Status } from "./features/status/Status";

export const App = () => (
  <div className="App">
    <main className="App-main">
      {/* <Status />
      <Board />
      <Log />
      <PlayArea />
      <Player /> */}
      <GameList />
    </main>
  </div>
);
