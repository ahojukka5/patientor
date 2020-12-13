export const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};
