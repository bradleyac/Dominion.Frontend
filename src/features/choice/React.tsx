import { JSX } from "react";
import { useAppSelector } from "../../app/hooks";
import { PlayerReactChoice, selectActiveChoice } from "../game/gameSlice";
import { Card } from "../card/Card";
import styles from "./React.module.css";

export const React = (): JSX.Element => {
  const choice = useAppSelector(selectActiveChoice);
  return (
    <>
      {choice && choice.$type === "react" && (
        <ReactImpl choice={choice as PlayerReactChoice} />
      )}
    </>
  );
};

export const ReactImpl = ({
  choice,
}: {
  choice: PlayerReactChoice;
}): JSX.Element => {
  return (
    <div className={styles.react}>
      <div className={styles.cards}>
        {choice.effectReferences.map((effectReference) => (
          <div
            className={styles.effect}
            key={effectReference.cardInstance.instanceId}
          >
            <div>{effectReference.prompt}</div>
            <Card
              cardId={effectReference.cardInstance.cardId}
              cardInstanceId={effectReference.cardInstance.instanceId}
              zone="TempSelect"
              isCompact={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
