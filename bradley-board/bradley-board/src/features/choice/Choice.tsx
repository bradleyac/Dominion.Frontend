import { JSX, useContext } from "react";
import { GameContext } from "../game/gameContext";
import { SignalrContext } from "../../app/signalrContext";
import { selectActiveChoice, selectChoiceSatisfied, selectSelectedCards } from "../board/boardSlice";
import { useAppSelector } from "../../app/hooks";
import styles from "./Choice.module.css";

export const Choice = (): JSX.Element => {
  const { gameId, playerId } = useContext(GameContext);
  const signalrConnector = useContext(SignalrContext);
  const filterSatisfied = useAppSelector(selectChoiceSatisfied);
  const selectedCards = useAppSelector(selectSelectedCards);
  const activeChoice = useAppSelector(selectActiveChoice);

  if (!activeChoice) {
    return <></>;
  }

  return <div className={styles.choice}>
    <div className={styles.prompt}>{activeChoice.prompt}</div>
    <div className={styles.actions}>
      {filterSatisfied && <button disabled={!filterSatisfied} onClick={() => signalrConnector?.chooseCards(gameId, playerId, selectedCards)}>Submit {selectedCards.length} Card{selectedCards.length === 1 ? "" : "s"}</button>}
      {!activeChoice.isForced && <button onClick={() => signalrConnector?.declineChoice(gameId, playerId)}>Decline</button>}
    </div>
  </div>;
}