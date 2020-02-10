export const clamp = (a: number, b: number) => (x: number) =>
  Math.max(a, Math.min(b, x));

export const lerp = (a: number, b: number) => (x: number) =>
  a * (1 - x) + b * x;

export const inverseLerp = (a: number, b: number) => (x: number) =>
  (x - a) / (b - a);

export const mod = (x: number, m: number) => ((x % m) + m) % m;
