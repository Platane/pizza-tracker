import { useState, useEffect } from "react";

export const useTwitterSDK = () => {
  const w = (typeof window !== "undefined" && (window as any)) || {};

  const [twttr, setTwttr] = useState(
    w.twttr && w.twttr.init ? w.twttr : undefined
  );

  useEffect(() => {
    if (twttr) return;

    if (!w.twttr) {
      w.twttr = {
        ready: fn => w.twttr._e.push(fn),
        _e: [] as any[]
      };

      const script = document.createElement("script");
      script.id = "twitter-wjs";
      script.src = "https://platform.twitter.com/widgets.js";

      document.body.appendChild(script);
    }

    w.twttr.ready(twttr => setTwttr(twttr));
  }, []);

  return twttr;
};
