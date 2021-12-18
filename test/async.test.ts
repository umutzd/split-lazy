import { asyncSplitLazy } from '../src';

async function* dummyGenerator() {
  yield 1;
  yield 3;
  yield 5;
  yield 7;
  yield 9;
  yield 11;
  yield 5;
  yield 7;
  yield 13;
  yield 7;
  yield 9;
}

describe('ASYNC', () => {
  describe('splitting an async iterator', () => {
    it('yields with array of splitted items correctly', async () => {
      const iterable = dummyGenerator();
      const result = asyncSplitLazy(iterable, 5);

      expect((await result.next()).value).toEqual([1, 3]);
      expect((await result.next()).value).toEqual([7, 9, 11]);
      expect((await result.next()).value).toEqual([7, 13, 7, 9]);
      expect((await result.next()).value).toEqual(undefined);
    });

    it('should yield empty array first if given separator is found in the beginning of iterable', async () => {
      const iterable = dummyGenerator();
      const result = asyncSplitLazy(iterable, 1);

      expect((await result.next()).value).toEqual([]);
      expect((await result.next()).value).toEqual([
        3,
        5,
        7,
        9,
        11,
        5,
        7,
        13,
        7,
        9,
      ]);
      expect((await result.next()).value).toEqual(undefined);
    });

    it('should yield empty array last if given separator is found in the end of iterable', async () => {
      const iterable = dummyGenerator();
      const result = asyncSplitLazy(iterable, 9);

      expect((await result.next()).value).toEqual([1, 3, 5, 7]);
      expect((await result.next()).value).toEqual([11, 5, 7, 13, 7]);
      expect((await result.next()).value).toEqual([]);
      expect((await result.next()).value).toEqual(undefined);
    });
  });

  describe('splitting an async iterator with sub array', () => {
    it('yields with array of splitted items correctly', async () => {
      const iterable = dummyGenerator();
      const result = asyncSplitLazy(iterable, [5, 7]);

      expect((await result.next()).value).toEqual([1, 3]);
      expect((await result.next()).value).toEqual([9, 11]);
      expect((await result.next()).value).toEqual([13, 7, 9]);
      expect((await result.next()).value).toEqual(undefined);
    });

    it('should yield empty array first if given separator is found in the beginning of iterable', async () => {
      const iterable = dummyGenerator();
      const result = asyncSplitLazy(iterable, [1, 3]);

      expect((await result.next()).value).toEqual([]);
      expect((await result.next()).value).toEqual([
        5,
        7,
        9,
        11,
        5,
        7,
        13,
        7,
        9,
      ]);
      expect((await result.next()).value).toEqual(undefined);
    });

    it('should yield empty array last if given separator is found in the end of iterable', async () => {
      const iterable = dummyGenerator();
      const result = asyncSplitLazy(iterable, [7, 9]);

      expect((await result.next()).value).toEqual([1, 3, 5]);
      expect((await result.next()).value).toEqual([11, 5, 7, 13]);
      expect((await result.next()).value).toEqual([]);
      expect((await result.next()).value).toEqual(undefined);
    });
  });

  describe('splitting an async iterator with async sub iterator', () => {
    it('should yield with array of splitted items correctly', async () => {
      async function* separatorGenerator() {
        yield 5;
        yield 7;
      }

      const iterable = dummyGenerator();
      const separator = separatorGenerator();
      const result = asyncSplitLazy(iterable, separator);

      expect((await result.next()).value).toEqual([1, 3]);
      expect((await result.next()).value).toEqual([9, 11]);
      expect((await result.next()).value).toEqual([13, 7, 9]);
      expect((await result.next()).value).toEqual(undefined);
    });

    it('should yield empty array first if given separator is found in the beginning of iterable', async () => {
      async function* separatorGenerator() {
        yield 1;
        yield 3;
      }

      const iterable = dummyGenerator();
      const separator = separatorGenerator();
      const result = asyncSplitLazy(iterable, separator);

      expect((await result.next()).value).toEqual([]);
      expect((await result.next()).value).toEqual([
        5,
        7,
        9,
        11,
        5,
        7,
        13,
        7,
        9,
      ]);
      expect((await result.next()).value).toEqual(undefined);
    });

    it('should yield empty array last if given separator is found in the end of iterable', async () => {
      async function* separatorGenerator() {
        yield 7;
        yield 9;
      }

      const iterable = dummyGenerator();
      const separator = separatorGenerator();
      const result = asyncSplitLazy(iterable, separator);

      expect((await result.next()).value).toEqual([1, 3, 5]);
      expect((await result.next()).value).toEqual([11, 5, 7, 13]);
      expect((await result.next()).value).toEqual([]);
      expect((await result.next()).value).toEqual(undefined);
    });
  });

  // 🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈

  describe('splitting an async iterator with non-async sub iterator', () => {
    it('should yield with array of splitted items correctly', async () => {
      function* separatorGenerator() {
        yield 5;
        yield 7;
      }

      const iterable = dummyGenerator();
      const separator = separatorGenerator();

      const result = asyncSplitLazy(iterable, separator);

      expect((await result.next()).value).toEqual([1, 3]);
      expect((await result.next()).value).toEqual([9, 11]);
      expect((await result.next()).value).toEqual([13, 7, 9]);
      expect((await result.next()).value).toEqual(undefined);
    });

    it('should yield empty array first if given separator is found in the beginning of iterable', async () => {
      function* separatorGenerator() {
        yield 1;
        yield 3;
      }

      const iterable = dummyGenerator();
      const separator = separatorGenerator();
      const result = asyncSplitLazy(iterable, separator);

      expect((await result.next()).value).toEqual([]);
      expect((await result.next()).value).toEqual([
        5,
        7,
        9,
        11,
        5,
        7,
        13,
        7,
        9,
      ]);
      expect((await result.next()).value).toEqual(undefined);
    });

    it('should yield empty array last if given separator is found in the end of iterable', async () => {
      function* separatorGenerator() {
        yield 7;
        yield 9;
      }

      const iterable = dummyGenerator();
      const separator = separatorGenerator();
      const result = asyncSplitLazy(iterable, separator);

      expect((await result.next()).value).toEqual([1, 3, 5]);
      expect((await result.next()).value).toEqual([11, 5, 7, 13]);
      expect((await result.next()).value).toEqual([]);
      expect((await result.next()).value).toEqual(undefined);
    });
  });
});
