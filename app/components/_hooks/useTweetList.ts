import { Step } from "../../../entities/Step";
import { inverseLerp, lerp } from "../../utils/math";
import { useMemo } from "react";

const scaleS = [1, 0.3, 0.12, 0.08, 0.01, 0.002, 0.002];
const scaleY = scaleS.slice().reverse();

const getInterval = (steps: Step[], date: number, [min, max]) => {
  if (steps.length === 0) return { a: undefined, b: undefined, k: 0.5 };

  if (date < steps[0].date)
    return {
      a: undefined,
      b: 0,
      k: 1
      // k: inverseLerp(min, steps[0].date)(date)
    };

  const b = steps.findIndex(s => s.date >= date);

  if (!steps[b])
    return {
      a: steps.length - 1,
      b: undefined,
      k: 0
      // k: inverseLerp(steps[steps.length - 1].date, max)(date)
    };

  return {
    a: b - 1,
    b,
    k: inverseLerp(steps[b - 1].date, steps[b].date)(date)
  };
};

const computeSize = (steps: Step[], date: number, limit) => {
  const { a, b, k } = getInterval(steps, date, limit);

  return steps.map(({ tweet_id }, i) => {
    let y = i < (a || 0) ? -1 : 1;
    let s = 0;

    // if (a !== undefined && scaleS[a - i] && scaleS[a - i + 1]) {
    //   s = lerp(scaleS[a - i], scaleS[a - i + 1])(1 - k);
    //   y = 1 - s;
    // } else
    //

    if (i === b) {
      s = lerp(scaleS[1], scaleS[0])(k);
      y = 1 - s;
    } else if (i === a) {
      s = lerp(scaleS[0], scaleS[1])(k);
      y = -(1 - s);
    } else if (b !== undefined && i > b && i - b + 1 < scaleS.length) {
      s = lerp(scaleS[i - b + 1], scaleS[i - b])(k);
      y = 1 - s;
    } else if (a !== undefined && i < a && a - i + 1 < scaleS.length) {
      s = lerp(scaleS[a - i], scaleS[a - i + 1])(k);
      y = -(1 - s);
    }
    //
    //
    // else if (a !== undefined && scaleS[a - i] && scaleS[a - i + 1]) {
    //   s = lerp(scaleS[a - i], scaleS[a - i + 1])(1 - k);
    //   y = 1 - s;
    // }
    //
    // //
    //
    // //
    // else if (b !== undefined && scaleS[i - b] && scaleS[i - b + 1]) {
    //   s = lerp(scaleS[i - b], scaleS[i - b + 1])(k);
    //   y = -(1 - s);
    // }

    return { tweet_id, s, y };
  });
};

export const useTweetList = (users, date: number, limit) => {
  const steps = useMemo(
    () =>
      users
        .map(u => u.steps)
        .flat()
        .filter(s => limit[0] < s.date && s.date < limit[1])
        .sort((a, b) => a.date - b.date),
    [users, limit]
  );

  const tweets = useMemo(() => computeSize(steps, date, limit), [
    steps,
    date,
    limit
  ]);

  return tweets;
};

// export const useTweetList = (steps: Step[], date: number, [min, max]) =>
//   useMemo(
//     () =>
//       steps.map(s => {
//         if (date < s.date) {
//           const k = date === max ? 1 : inverseLerp(date, max)(s.date);
//
//           return { ...s, y: lerp(0, 1)(k) };
//         } else {
//           const k = min === date ? -1 : inverseLerp(min, date)(s.date);
//
//           return { ...s, y: lerp(-1, 0)(k) };
//         }
//       }),
//     [date, steps]
//   );

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
