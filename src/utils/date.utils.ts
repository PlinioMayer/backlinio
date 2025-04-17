export const daysBetween = (d1: Date, d2: Date): number => {
  return Math.round((d2.getTime() - d1.getTime()) / (24 * 60 * 60 * 1000));
};

export const format = (d: Date): string => {
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`;
};
