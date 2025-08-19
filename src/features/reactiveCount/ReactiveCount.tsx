import { useEffect, useRef, useState } from "react";

const incrementStates = [
  { color: "inherit" },
  { color: "oklch(from var(--icon-color) calc(l + .1) c h" },
  { color: "inherit" },
]

const decrementStates = [
  { color: "inherit" },
  { color: "oklch(from var(--icon-color) calc(l - .1) c h" },
  { color: "inherit" },
]

const animationSettings = {
  duration: 700,
  easing: "linear"
};

const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

export const ReactiveCount = ({ count }: { count: number }) => {
  const [lastCount, setLastCount] = useState(count);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    setLastCount(count);
    if (count > lastCount) {
      counterRef.current?.animate(incrementStates, animationSettings)
    }
    else if (count < lastCount) {
      counterRef.current?.animate(decrementStates, animationSettings)
    }
  }, [count])

  return (
    <span ref={counterRef}>{count}</span>
  );
}