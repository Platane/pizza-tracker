import { useMemo } from "react";
import { Step } from "../../../entities/Step";
import PRNG from "prng";
import { inverseLerp } from "../../utils/math";

const colors = [
  [0.1, 0.7, 0.5, 1],
  [0.8, 0.3, 0.4, 1],
  [0.3, 0.4, 0.9, 1]
];

const computeEstimation = (
  steps: { date: number; count: number }[],
  [min, max]
) => {
  if (steps.length === 0) return [];

  // initialize pseudo random generator
  const seed = steps.length + steps[Math.floor(steps.length / 3)].count;
  const prng = new PRNG(seed);

  const maxCount = Math.max(0, ...steps.map(s => s.count));
  const maxDate = Math.max(min + 1, ...steps.map(s => s.date));

  const vDate = (maxDate - min) / steps.length;
  const vCount = maxCount / steps.length;

  const n = ((max - maxDate) / vDate) * prng.rand(90, 110) * 0.01;

  let last = steps[steps.length - 1] || { date: min, count: 0 };

  return Array.from({ length: n }, (_, i) => {
    const remainingDate = max - last.date;

    return (last = {
      date: last.date + (remainingDate / (n - i)) * prng.rand(80, 98) * 0.01,
      count: last.count + Math.ceil(vCount * prng.rand(60, 140) * 0.01)
    });
  });
};

const computeLine = (steps: { date: number; count: number }[], [min, max]) => {
  const complete = Date.now() > max;

  const s = [
    ...steps,
    ...(complete ? [] : computeEstimation(steps, [min, max]))
  ];

  const points = [
    { count: 0, date: min },
    ...s,
    { count: s[s.length - 1] ? s[s.length - 1].count : 0, date: max }
  ];

  return {
    points,
    estimationStart: complete ? max : (steps[0] || { date: min }).date
  };
};

const computeLines = (users: { userName: string; steps: Step[] }[], limit) => {
  const userPoints = users.map(u =>
    computeLine(
      u.steps.filter(s => limit[0] < s.date && s.date < limit[1]),
      limit
    )
  );

  const maxCount = Math.max(
    ...userPoints.map(u => u.points[u.points.length - 1].count)
  );

  return userPoints
    .map(({ points, estimationStart }, i) => ({
      values: points.map(({ count, date }) => ({
        y: count,
        x: inverseLerp(limit[0], limit[1])(date) * 12
      })),
      points: points.map(({ count, date }) => ({
        y: (count / maxCount) * 5,
        x: inverseLerp(limit[0], limit[1])(date) * 12
      })),
      // dashStart: inverseLerp(limit[0], limit[1])(estimationStart) * 12,
      dashStart: Math.min(inverseLerp(limit[0], limit[1])(Date.now()), 1) * 12,
      color: colors[i % colors.length]
    }))
    .filter(({ points }) => points.length > 2);
};

export const useLines = (users, limit) =>
  useMemo(() => computeLines(users, limit), [users, limit]);
