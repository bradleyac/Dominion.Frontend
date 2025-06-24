import "./App.css"
import { Board } from "./features/board/Board"
import { Player } from "./features/player/Player"

export const App = () => (
  <div className="App">
    <header className="App-header">
      <Board />
      <Player />
    </header>
  </div>
)
