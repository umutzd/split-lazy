import { splitLazy } from '../src';

describe('SYNC', () => {
  describe('splitting a string', () => {
    it('yields with array of splitted items correctly', () => {
      const str = 'test/1';
      const iterable = splitLazy(str, '/');

      expect(iterable.next().value).toEqual(['t', 'e', 's', 't']);
      expect(iterable.next().value).toEqual(['1']);
    });

    it('should return empty array first if given separator is found in the beginning of iterable', () => {
      const str = '/test/1';
      const iterable = splitLazy(str, '/');

      expect(iterable.next().value).toEqual([]);
      expect(iterable.next().value).toEqual(['t', 'e', 's', 't']);
      expect(iterable.next().value).toEqual(['1']);
    });

    it('should return empty array last if given separator is found in the end of iterable', () => {
      const str = 'test/1/';
      const iterable = splitLazy(str, '/');

      expect(iterable.next().value).toEqual(['t', 'e', 's', 't']);
      expect(iterable.next().value).toEqual(['1']);
      expect(iterable.next().value).toEqual([]);
    });
  });

  describe('splitting an array', () => {
    it('yields with array of splitted items correctly', () => {
      const arr = [1, 3, 5, 7, 9];
      const iterable = splitLazy(arr, 5);

      expect(iterable.next().value).toEqual([1, 3]);
      expect(iterable.next().value).toEqual([7, 9]);
    });

    it('should return empty array first if given separator is found in the beginning of iterable', () => {
      const arr = [5, 1, 3, 5, 7, 9];
      const iterable = splitLazy(arr, 5);

      expect(iterable.next().value).toEqual([]);
      expect(iterable.next().value).toEqual([1, 3]);
      expect(iterable.next().value).toEqual([7, 9]);
    });

    it('should return empty array last if given separator is found in the end of iterable', () => {
      const arr = [1, 3, 5, 7, 9, 5];
      const iterable = splitLazy(arr, 5);

      expect(iterable.next().value).toEqual([1, 3]);
      expect(iterable.next().value).toEqual([7, 9]);
      expect(iterable.next().value).toEqual([]);
    });
  });

  describe.only('splitting an array with sub array', () => {
    it('yields with array of splitted items correctly', () => {
      const arr = [1, 3, 5, 7, 9, 11];
      const iterable = splitLazy(arr, [5, 7]);

      expect(iterable.next().value).toEqual([1, 3]);
      expect(iterable.next().value).toEqual([9, 11]);
    });

    it('should return empty array first if given sub iterable is found in the beginning of iterable', () => {
      const arr = [5, 4, 1, 3, 5, 4, 7, 9];
      const iterable = splitLazy(arr, [5, 4]);

      expect(iterable.next().value).toEqual([]);
      expect(iterable.next().value).toEqual([1, 3]);
      expect(iterable.next().value).toEqual([7, 9]);
    });

    it('should return empty array last if given separator is found in the end of iterable', () => {
      const arr = [1, 3, 5, 4, 7, 9, 5, 4];
      const iterable = splitLazy(arr, [5, 4]);

      expect(iterable.next().value).toEqual([1, 3]);
      expect(iterable.next().value).toEqual([7, 9]);
      expect(iterable.next().value).toEqual([]);
    });
  });
});
