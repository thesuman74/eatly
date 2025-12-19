// hooks/useSecondTicker.ts
import { useEffect, useState } from "react";

export function useSecondTicker() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);
}
