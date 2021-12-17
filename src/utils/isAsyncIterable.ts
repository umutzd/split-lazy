export const isAsyncIterable = <T extends unknown>(
  value: any
): value is AsyncIterable<T> => {
  return Symbol.asyncIterator in Object(value);
};
