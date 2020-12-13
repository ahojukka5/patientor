export const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

export const isEmpty = (obj: object) => {
  return Object.keys(obj).length === 0;
};
