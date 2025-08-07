import { JSX, useContext } from "react";
import { GameContext } from "../game/gameContext";
import { SignalrContext } from "../../app/signalrContext";
import {
  selectActiveChoice,
  selectActivePlayer,
  selectArrangedCards,
  selectCategorizations,
  selectChoiceSatisfied,
  selectCurrentPlayer,
  selectMyPlayerId,
  selectSelectedCards,
} from "../game/gameSlice";
import { useAppSelector } from "../../app/hooks";
import styles from "./Choice.module.css";

export const Choice = (): JSX.Element => {
  const { gameId } = useContext(GameContext);
  const signalrConnector = useContext(SignalrContext);
  const filterSatisfied = useAppSelector(selectChoiceSatisfied);
  const selectedCards = useAppSelector(selectSelectedCards);
  const categorizedCards = useAppSelector(selectCategorizations);
  const arrangedCards = useAppSelector(selectArrangedCards);
  const activeChoice = useAppSelector(selectActiveChoice);
  const activePlayer = useAppSelector(selectActivePlayer);
  const currentPlayer = useAppSelector(selectCurrentPlayer);
  const playerId = useAppSelector(selectMyPlayerId);

  if (!activeChoice) {
    if (playerId === currentPlayer && activePlayer !== currentPlayer) {
      return (
        <div className={styles.choice}>
          <div className={styles.prompt}>Waiting on {activePlayer}</div>
        </div>
      );
    } else {
      return <></>;
    }
  }

  return (
    <div className={styles.choice}>
      <div className={styles.prompt}>{activeChoice.prompt}</div>
      <div className={styles.actions}>
        {filterSatisfied && activeChoice.$type === "select" && (
          <button
            disabled={!filterSatisfied}
            onClick={() =>
              signalrConnector?.chooseCards(
                gameId,
                activeChoice.id,
                selectedCards,
              )
            }
          >
            Submit {selectedCards.length} Card
            {selectedCards.length === 1 ? "" : "s"}
          </button>
        )}
        {filterSatisfied && activeChoice.$type === "categorize" && (
          <button
            disabled={!filterSatisfied}
            onClick={() =>
              signalrConnector?.categorizeCards(
                gameId,
                activeChoice.id,
                categorizedCards,
              )
            }
          >
            Submit
          </button>
        )}
        {filterSatisfied && activeChoice.$type === "arrange" && (
          <button
            disabled={!filterSatisfied}
            onClick={() =>
              signalrConnector?.arrangeCards(
                gameId,
                activeChoice.id,
                arrangedCards,
              )
            }
          >
            Submit
          </button>
        )}
        {filterSatisfied && activeChoice.$type === "react" && (
          <button
            disabled={!filterSatisfied}
            onClick={() =>
              signalrConnector?.chooseCards(
                gameId,
                activeChoice.id,
                selectedCards,
              )
            }
          >
            Submit
          </button>
        )}
        {!activeChoice.isForced && (
          <button
            onClick={() =>
              signalrConnector?.declineChoice(gameId, activeChoice.id)
            }
          >
            Decline
          </button>
        )}
      </div>
    </div>
  );
};
