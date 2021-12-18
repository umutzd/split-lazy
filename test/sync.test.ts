import { splitLazy, splitLazyString } from '../src';

function* dummyGenerator() {
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

describe('SYNC', () => {
  describe('splitting an array', () => {
    it('should yield with array of splitted items correctly', () => {
      const arr = [1, 3, 5, 7, 9];
      const iterable = splitLazy(arr, 5);

      expect(iterable.next().value).toEqual([1, 3]);
      expect(iterable.next().value).toEqual([7, 9]);
      expect(iterable.next().value).toEqual(undefined);
    });

    it('should yield empty array first if given separator is found in the beginning of iterable', () => {
      const arr = [1, 3, 5, 7, 9];
      const iterable = splitLazy(arr, 1);

      expect(iterable.next().value).toEqual([]);
      expect(iterable.next().value).toEqual([3, 5, 7, 9]);
      expect(iterable.next().value).toEqual(undefined);
    });

    it('should yield empty array last if given separator is found in the end of iterable', () => {
      const arr = [1, 3, 5, 7, 9];
      const iterable = splitLazy(arr, 9);

      expect(iterable.next().value).toEqual([1, 3, 5, 7]);
      expect(iterable.next().value).toEqual([]);
      expect(iterable.next().value).toEqual(undefined);
    });

    it('should yield all elements if not found anything', () => {
      const arr = [1, 3, 5, 7, 9];
      const iterable = splitLazy(arr, 0);

      expect(iterable.next().value).toEqual([1, 3, 5, 7, 9]);
      expect(iterable.next().value).toEqual(undefined);
    });
  });

  describe('splitting an iterator', () => {
    it('should yield with array of splitted items correctly', () => {
      const iterable = dummyGenerator();
      const result = splitLazy(iterable, 5);

      expect(result.next().value).toEqual([1, 3]);
      expect(result.next().value).toEqual([7, 9, 11]);
      expect(result.next().value).toEqual([7, 13, 7, 9]);
      expect(result.next().value).toEqual(undefined);
    });

    it('should yield empty array first if given separator is found in the beginning of iterable', () => {
      const iterable = dummyGenerator();
      const result = splitLazy(iterable, 1);

      expect(result.next().value).toEqual([]);
      expect(result.next().value).toEqual([3, 5, 7, 9, 11, 5, 7, 13, 7, 9]);
      expect(result.next().value).toEqual(undefined);
    });

    it('should yield empty array last if given separator is found in the end of iterable', () => {
      const iterable = dummyGenerator();
      const result = splitLazy(iterable, 9);

      expect(result.next().value).toEqual([1, 3, 5, 7]);
      expect(result.next().value).toEqual([11, 5, 7, 13, 7]);
      expect(result.next().value).toEqual([]);
      expect(result.next().value).toEqual(undefined);
    });

    it('should yield all elements if not found anything', () => {
      const iterable = dummyGenerator();
      const result = splitLazy(iterable, 0);

      expect(result.next().value).toEqual([1, 3, 5, 7, 9, 11, 5, 7, 13, 7, 9]);
      expect(result.next().value).toEqual(undefined);
    });
  });

  describe('splitting an iterator with sub array', () => {
    it('should yield with array of splitted items correctly', () => {
      const iterable = dummyGenerator();
      const result = splitLazy(iterable, [5, 7]);

      expect(result.next().value).toEqual([1, 3]);
      expect(result.next().value).toEqual([9, 11]);
      expect(result.next().value).toEqual([13, 7, 9]);
      expect(result.next().value).toEqual(undefined);
    });

    it('should yield empty array first if given separator is found in the beginning of iterable', () => {
      const iterable = dummyGenerator();
      const result = splitLazy(iterable, [1, 3]);

      expect(result.next().value).toEqual([]);
      expect(result.next().value).toEqual([5, 7, 9, 11, 5, 7, 13, 7, 9]);
      expect(result.next().value).toEqual(undefined);
    });

    it('should yield empty array last if given separator is found in the end of iterable', () => {
      const iterable = dummyGenerator();
      const result = splitLazy(iterable, [7, 9]);

      expect(result.next().value).toEqual([1, 3, 5]);
      expect(result.next().value).toEqual([11, 5, 7, 13]);
      expect(result.next().value).toEqual([]);
      expect(result.next().value).toEqual(undefined);
    });

    it('should yield all elements if not found anything', () => {
      const iterable = dummyGenerator();
      const result = splitLazy(iterable, [0]);

      expect(result.next().value).toEqual([1, 3, 5, 7, 9, 11, 5, 7, 13, 7, 9]);
      expect(result.next().value).toEqual(undefined);
    });
  });

  describe('splitting an iterator with sub iterator', () => {
    it('should yield with array of splitted items correctly', () => {
      function* separatorGenerator() {
        yield 5;
        yield 7;
      }

      const iterable = dummyGenerator();
      const separator = separatorGenerator();

      const result = splitLazy(iterable, separator);

      expect(result.next().value).toEqual([1, 3]);
      expect(result.next().value).toEqual([9, 11]);
      expect(result.next().value).toEqual([13, 7, 9]);
      expect(result.next().value).toEqual(undefined);
    });

    it('should yield empty array first if given separator is found in the beginning of iterable', () => {
      function* separatorGenerator() {
        yield 1;
        yield 3;
      }

      const iterable = dummyGenerator();
      const separator = separatorGenerator();
      const result = splitLazy(iterable, separator);

      expect(result.next().value).toEqual([]);
      expect(result.next().value).toEqual([5, 7, 9, 11, 5, 7, 13, 7, 9]);
      expect(result.next().value).toEqual(undefined);
    });

    it('should yield empty array last if given separator is found in the end of iterable', () => {
      function* separatorGenerator() {
        yield 7;
        yield 9;
      }

      const iterable = dummyGenerator();
      const separator = separatorGenerator();
      const result = splitLazy(iterable, separator);

      expect(result.next().value).toEqual([1, 3, 5]);
      expect(result.next().value).toEqual([11, 5, 7, 13]);
      expect(result.next().value).toEqual([]);
      expect(result.next().value).toEqual(undefined);
    });

    it('should yield all elements if not found anything', () => {
      function* separatorGenerator() {
        yield 0;
      }

      const iterable = dummyGenerator();
      const separator = separatorGenerator();
      const result = splitLazy(iterable, separator);

      expect(result.next().value).toEqual([1, 3, 5, 7, 9, 11, 5, 7, 13, 7, 9]);
      expect(result.next().value).toEqual(undefined);
    });
  });
});

describe('splitting a string with splitLazyString', () => {
  it('should yield with iterable of splitted parts', () => {
    const str = 'test/1';
    const iterable = splitLazyString(str, '/');

    expect(iterable.next().value).toEqual('test');
    expect(iterable.next().value).toEqual('1');
    expect(iterable.next().value).toEqual(undefined);
  });

  it('should yield empty array first if given sub iterable is found in the beginning of iterable', () => {
    const str = 'test/1';
    const iterable = splitLazyString(str, 't');

    expect(iterable.next().value).toEqual('');
    expect(iterable.next().value).toEqual('es');
    expect(iterable.next().value).toEqual('/1');
    expect(iterable.next().value).toEqual(undefined);
  });

  it('should yield empty array last if given separator is found in the end of iterable', () => {
    const str = 'test/1';
    const iterable = splitLazyString(str, '1');

    expect(iterable.next().value).toEqual('test/');
    expect(iterable.next().value).toEqual('');
    expect(iterable.next().value).toEqual(undefined);
  });

  it('should all elements if not found anything', () => {
    const str = 'test/1';
    const iterable = splitLazyString(str, '0');

    expect(iterable.next().value).toEqual('test/1');
    expect(iterable.next().value).toEqual(undefined);
  });
});
