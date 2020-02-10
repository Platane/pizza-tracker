import { useState, useEffect } from "react";

const MAX_HEIGHT = window.innerHeight * 10;

export const useScrollValue = () => {
  const [k, setK] = useState(0);

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.body.style.height = MAX_HEIGHT + "px";

    const onScroll = () => {
      const k = window.scrollY / (MAX_HEIGHT - window.innerHeight);
      setK(k);
    };

    window.addEventListener("resize", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return k;
};
