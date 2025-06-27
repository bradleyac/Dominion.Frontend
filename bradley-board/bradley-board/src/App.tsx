import "./App.css"
import { Board } from "./features/board/Board"
import { PlayArea } from "./features/playArea/PlayArea"
import { Player } from "./features/player/Player"
import { Status } from "./features/status/Status"

export const App = () => (
  <div className="App">
    <main className="App-main">
      <Status />
      <Board />
      <PlayArea />
      <Player />
    </main>
  </div>
)
