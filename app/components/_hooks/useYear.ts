import { useEffect, useState } from "react";

const firstYear = 2017;
const currentYear = new Date().getFullYear();
const defaultYear = currentYear;

export const years = Array.from({ length: currentYear - firstYear + 1 }).map(
  (_, i) => firstYear + i
);

const readYear = () => {
  if (typeof location !== "undefined") {
    const year = parseInt(location.hash.slice(1));

    if (years.includes(year)) return year;
  }

  return defaultYear;
};

const writeYear = year => {
  if (typeof history !== "undefined") {
    history.replaceState(
      null,
      undefined as any,
      location.pathname + location.search + "#" + year
    );
  }
};

export const useYear = () => {
  const [year, setYear] = useState(readYear());

  useEffect(() => {
    writeYear(year);
  }, []);

  useEffect(() => {
    writeYear(year);
  }, [year]);

  return [year, setYear] as const;
};
