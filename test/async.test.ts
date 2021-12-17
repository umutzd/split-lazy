import { asyncSplitLazy } from '../src';

async function* dummyGenerator() {
  yield 1;
  yield 3;
  yield 5;
  yield 7;
  yield 9;
}

describe('ASYNC', () => {
  describe('splitting an array', () => {
    it('yields with array of splitted items correctly', async () => {
      const iterable = dummyGenerator();
      const result = asyncSplitLazy(iterable, 5);

      expect((await result.next()).value).toEqual([1, 3]);
      expect((await result.next()).value).toEqual([7, 9]);
    });

    it('should return empty array first if given separator is found in the beginning of iterable', async () => {
      const iterable = dummyGenerator();
      const result = asyncSplitLazy(iterable, 1);

      expect((await result.next()).value).toEqual([]);
      expect((await result.next()).value).toEqual([3, 5, 7, 9]);
    });

    it('should return empty array last if given separator is found in the end of iterable', async () => {
      const iterable = dummyGenerator();
      const result = asyncSplitLazy(iterable, 9);

      expect((await result.next()).value).toEqual([1, 3, 5, 7]);
      expect((await result.next()).value).toEqual([]);
    });
  });
});
