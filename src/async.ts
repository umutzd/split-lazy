import { isAsyncIterable } from './utils';

export async function* asyncJoinAll(iterable: AsyncIterable<string[]>) {
  for await (const el of iterable) {
    yield el.join('');
  }
}

export async function* asyncSplitLazyWithSeparator<
  I,
  T extends AsyncIterable<I>
>(iterable: T, separator: I) {
  let yieldNext: I[] = [];

  for await (const item of iterable) {
    if (item === separator) {
      yield yieldNext;
      yieldNext = [];
    } else {
      yieldNext.push(item);
    }
  }

  yield yieldNext;
}

export async function* asyncSplitLazyWithSubIterator<
  I,
  T extends AsyncIterable<I>
>(iterable: T, subIterable: T) {
  let yieldNext: I[] = [];
  let subIterableItems = [];

  for await (const item of subIterable) {
    subIterableItems.push(item);
  }

  let foundSubIterator = 0;

  const iterator = iterable[Symbol.asyncIterator]();

  let next = await iterator.next();

  while (!next.done) {
    if (next.value === subIterableItems[foundSubIterator]) {
      foundSubIterator++;

      if (subIterableItems.length === foundSubIterator) {
        yield yieldNext;
        yieldNext = [];
      }
    } else {
      foundSubIterator = 0;
      yieldNext.push(next.value);
    }

    next = await iterator.next();
  }

  yield yieldNext;
}

export function asyncSplitLazy<I, T extends AsyncIterable<I>>(
  iterable: T,
  separator: T
): AsyncGenerator<I[], void, unknown>;
export function asyncSplitLazy<I, T extends AsyncIterable<I>>(
  iterable: T,
  separator: I
): AsyncGenerator<I[], void, unknown>;
export async function* asyncSplitLazy<I, T extends AsyncIterable<I>>(
  iterable: T,
  separator: unknown
) {
  if (isAsyncIterable(separator)) {
    for await (const value of asyncSplitLazyWithSubIterator(
      iterable,
      separator
    )) {
      yield value;
    }
  }

  for await (const value of asyncSplitLazyWithSeparator(iterable, separator)) {
    yield value;
  }
}
