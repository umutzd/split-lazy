export const isIterable = <T extends unknown>(
  value: any
): value is Iterable<T> => {
  return Symbol.iterator in Object(value);
};
