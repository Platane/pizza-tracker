import { useState, useEffect } from "react";

export const useTwitter = () => {
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

//
// import React, { useState, useEffect, createContext, useContext } from 'react'
//
// const TwitterContext = createContext({
//   twttr: null as any
// })
//
// export const TwitterProvider = ({  children }) => {
//
//   const [twttr,setTwttr]
//
//
// }
//   <HistoryContext.Provider
//     value={{ history: history || createBrowserHistory() }}
//   >
//     {children}
//   </HistoryContext.Provider>
// )
//
// export const useHistory = () => useContext(HistoryContext).history
//
// export const usePathname = () => useLocation().pathname
//
// export const useLocation = () => {
//   const history = useHistory()
//
//   const readLocation = () => ({
//     pathname: history.location.pathname,
//     search: history.location.search,
//     hash: history.location.hash,
//   })
//
//   const [location, setLocation] = useState(readLocation())
//
//   useEffect(() => history.listen(() => setLocation(readLocation())), [history])
//
//   return location
// }
//
// export const useNavigate = () => {
//   const history = useHistory()
//
//   return (url: string, push = true) =>
//     push ? history.push(url) : history.replace(url)
// }
