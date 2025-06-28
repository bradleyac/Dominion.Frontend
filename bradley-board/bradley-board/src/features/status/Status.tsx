import { JSX } from "react";
import styles from "./Status.module.css"
import { selectCurrentPlayerName, selectPlayerScore, selectTurn } from "../board/boardSlice";
import { useAppSelector } from "../../app/hooks";

export const Status = (): JSX.Element => {
    const score = useAppSelector(selectPlayerScore);
    const turn = useAppSelector(selectTurn);
    const currentPlayerName = useAppSelector(selectCurrentPlayerName)

    return <div className={styles.status}>
        <p>{currentPlayerName}</p>
        <p>Turn: {turn}</p>
        <p>Score: {score}</p>
    </div>
}