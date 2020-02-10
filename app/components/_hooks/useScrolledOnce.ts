import { useEffect, useState } from "react";
import { wait } from "../../utils/time";

export const useScrolledOnce = () => {
  const [scrolledOnce, setScrolledOnce] = useState(false);

  useEffect(() => {
    if (scrolledOnce) return;

    const handler = () => {
      setScrolledOnce(true);
    };

    wait(200).then(() => {
      document.addEventListener("scroll", handler, {
        passive: true,
        once: true
      });
    });

    return () => document.removeEventListener("scroll", handler);
  }, [scrolledOnce]);

  return scrolledOnce;
};
