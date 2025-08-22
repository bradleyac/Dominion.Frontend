import { PropsWithChildren, useRef, useState } from "react"
import { animated, useSpring } from '@react-spring/web'
import { useDrag, } from "@use-gesture/react"
import styles from "./DraggableFrame.module.css"

export const DraggableFrame = ({ children }: PropsWithChildren<{}>) => {
  const [hidden, setHidden] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);
  const [{ x, y }, api] = useSpring(() => ({
    x: position.x,
    y: position.y,
  }), [position])

  useDrag(({ active, offset: [x, y] }) => {
    if (active) {
      api.start({
        x,
        y,
        immediate: true,
        onResolve: ({ value }) => setPosition(value)
      })
    }
  },
    {
      from: () => [x.get(), y.get()],
      target: dragRef
    });

  return (
    <animated.div className={`${styles.draggableFrame} ${hidden ? styles.hidden : styles.visible}`} style={{ x, y }} onClick={e => e.stopPropagation()}>
      <div ref={dragRef} className={styles.handle}>
        <button className={`${styles.eye} ${hidden ? "iconEye" : "iconEyeOff"}`} title={hidden ? "Show" : "Hide"} onClick={e => { setHidden(hidden => !hidden); e.stopPropagation(); }} />
      </div>
      <div className={styles.content} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </animated.div>
  )
}