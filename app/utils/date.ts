export const roundYear = d => {
  const date = new Date(d);
  date.setMonth(0);
  date.setDate(0);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date.getTime();
};
