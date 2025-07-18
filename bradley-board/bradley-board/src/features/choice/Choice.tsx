import { JSX, useContext } from "react";
import { GameContext } from "../game/gameContext";
import { SignalrContext } from "../../app/signalrContext";
import { selectActiveChoice, selectArrangedCards, selectCategorizations, selectChoiceSatisfied, selectSelectedCards } from "../board/boardSlice";
import { useAppSelector } from "../../app/hooks";
import styles from "./Choice.module.css";

export const Choice = (): JSX.Element => {
  const { gameId, playerId } = useContext(GameContext);
  const signalrConnector = useContext(SignalrContext);
  const filterSatisfied = useAppSelector(selectChoiceSatisfied);
  const selectedCards = useAppSelector(selectSelectedCards);
  const categorizedCards = useAppSelector(selectCategorizations);
  const arrangedCards = useAppSelector(selectArrangedCards);
  const activeChoice = useAppSelector(selectActiveChoice);

  if (!activeChoice) {
    return <></>;
  }

  return <div className={styles.choice}>
    <div className={styles.prompt}>{activeChoice.prompt}</div>
    <div className={styles.actions}>
      {filterSatisfied && activeChoice.$type === "select" && <button disabled={!filterSatisfied} onClick={() => signalrConnector?.chooseCards(gameId, playerId, activeChoice.id, selectedCards)}>Submit {selectedCards.length} Card{selectedCards.length === 1 ? "" : "s"}</button>}
      {filterSatisfied && activeChoice.$type === "categorize" && <button disabled={!filterSatisfied} onClick={() => signalrConnector?.categorizeCards(gameId, playerId, activeChoice.id, categorizedCards)}>Submit</button>}
      {filterSatisfied && activeChoice.$type === "arrange" && <button disabled={!filterSatisfied} onClick={() => signalrConnector?.arrangeCards(gameId, playerId, activeChoice.id, arrangedCards)}>Submit</button>}
      {!activeChoice.isForced && <button onClick={() => signalrConnector?.declineChoice(gameId, playerId, activeChoice.id)}>Decline</button>}
    </div>
  </div>;
}