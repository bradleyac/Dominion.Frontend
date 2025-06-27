import { JSX } from "react";
import styles from "./Status.module.css"
import { selectPlayerScore } from "../board/boardSlice";
import { useAppSelector } from "../../app/hooks";

export const Status = (): JSX.Element => {
    const score = useAppSelector(selectPlayerScore);
    return (<div className={styles.status}>
        Score: {score}
    </div>)
}