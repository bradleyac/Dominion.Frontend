import { Arrange } from "../choice/Arrange";
import { Categorize } from "../choice/Categorize";
import { PlayArea } from "../playArea/PlayArea";
import { PrivateReveal, Reveal } from "../reveal/Reveal";
import { React } from "../choice/React";
import { Choice } from "../choice/Choice";

import styles from "./NotBoard.module.css";
import { Resources } from "../resources/Resources";
import { Player } from "../player/Player";
import {
  PlayerSelectChoice,
  selectActiveChoice,
  selectGameResult,
} from "../game/gameSlice";
import { useAppSelector } from "../../app/hooks";
import { Result } from "../result/Result";

export const NotBoard = ({ leaveGame }: { leaveGame: () => Promise<void> }) => {
  const gameResult = useAppSelector(selectGameResult);
  const activeChoice = useAppSelector(selectActiveChoice);
  const canObscureHand =
    activeChoice?.$type !== "select" ||
    (activeChoice as PlayerSelectChoice)?.filter.from !== "Hand";
  const obscureClass = canObscureHand
    ? styles.obscureHand
    : styles.obscurePlayArea;
  return (
    <div className={styles.container}>
      <div className={styles.notBoard}>
        <div className={`${styles.prompt} ${obscureClass}`}>
          <Choice />
        </div>

        <div className={styles.playArea}>
          <PlayArea />
          <Reveal />
          <PrivateReveal />
          <Categorize />
          <Arrange />
          <React />
        </div>

        <div className={styles.resources}>
          <Resources />
        </div>

        <div className={styles.player}>
          <Player />
        </div>
      </div>
      {gameResult && (
        <div className={styles.overlay}>
          <div className={styles.result}>
            <Result result={gameResult} />
            <button onClick={leaveGame}>Leave Game</button>
          </div>
        </div>
      )}
    </div>
  );
};
