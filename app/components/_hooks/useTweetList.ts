import { Step } from "../../../entities/Step";
import { inverseLerp, lerp } from "../../utils/math";
import { useMemo } from "react";

const scaleS = [1, 0.3, 0.12, 0.08, 0.01, 0.002, 0.002];

const getInterval = (steps: Step[], date: number) => {
  if (steps.length === 0) return { a: undefined, b: undefined, k: 0.5 };

  if (date < steps[0].date)
    return {
      a: undefined,
      b: 0,
      k: 1
    };

  const b = steps.findIndex(s => s.date >= date);

  if (!steps[b])
    return {
      a: steps.length - 1,
      b: undefined,
      k: 0
    };

  return {
    a: b - 1,
    b,
    k: inverseLerp(steps[b - 1].date, steps[b].date)(date)
  };
};

const computeSize = (steps: Step[], date: number) => {
  const { a, b, k } = getInterval(steps, date);

  return steps.map(({ tweet_id }, i) => {
    let y = i < (a || 0) ? -1 : 1;
    let s = 0;

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

    return { tweet_id, s, y };
  });
};

export const useTweetList = (users, date: number, limit: [number, number]) => {
  const steps = useMemo(
    () =>
      users
        .map(u => u.steps)
        .flat()
        .filter(s => limit[0] < s.date && s.date < limit[1])
        .sort((a, b) => a.date - b.date),
    [users, limit]
  );

  const tweets = useMemo(() => computeSize(steps, date), [steps, date, limit]);

  return tweets;
};
