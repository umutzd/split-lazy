import { isIterable } from './utils';

export function* joinAll(iterable: Iterable<string[]>) {
  for (const el of iterable) {
    yield el.join('');
  }
}

export function* splitLazyWithSeparator<I, T extends Iterable<I>>(
  iterable: T,
  separator: I
) {
  let yieldNext: I[] = [];

  for (const item of iterable) {
    if (item === separator) {
      yield yieldNext;
      yieldNext = [];
    } else {
      yieldNext.push(item);
    }
  }

  yield yieldNext;
}

export function* splitLazyWithSubIterator<I, T extends Iterable<I>>(
  iterable: T,
  subIterable: T
) {
  let yieldNext: I[] = [];
  let subIterableItems = Array.from(subIterable);
  let foundSubIterator = 0;

  const iterator = iterable[Symbol.iterator]();

  let next = iterator.next();

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

    next = iterator.next();
  }

  yield yieldNext;
}

export function splitLazy<I, T extends Iterable<I>>(
  iterable: T,
  separator: T
): Generator<I[], void, void>;
export function splitLazy<I, T extends Iterable<I>>(
  iterable: T,
  separator: I
): Generator<I[], void, void>;
export function splitLazy<I, T extends Iterable<I>>(
  iterable: T,
  separator: unknown
) {
  if (isIterable(separator)) {
    return splitLazyWithSubIterator(iterable, separator);
  }

  return splitLazyWithSeparator(iterable, separator);
}

export function splitLazyString(iterable: string, separator: string) {
  return joinAll(
    splitLazyWithSubIterator(iterable, separator) as Generator<
      string[],
      void,
      void
    >
  );
}
