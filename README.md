# split-lazy 🗡🦥

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/ae3028bdccea48bf9a7b05ed91284fbd)](https://www.codacy.com/gh/miyavsu-limited/split-lazy/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=miyavsu-limited/split-lazy&amp;utm_campaign=Badge_Grade)
![Codacy coverage](https://img.shields.io/codacy/coverage/ae3028bdccea48bf9a7b05ed91284fbd)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/split-lazy)

This package provides ways to split arrays, strings or other iterables (sync and async) lazily. It returns an iterable that calculates the result lazily (while iterating on it).

[👉 Learn more about iterators here.][iterators]

## Installing

Use `yarn` or `npm` to install it.

```
npm install split-lazy
```

## `splitLazy`

```ts
function splitLazy<I, T extends Iterable<I>>(
  iterable: T,
  separator: unknown
): Generator<I[], void, void>
```

First argument is iterable to search inside and split. Second argument is either an iterable or an element to look for in the given first argument.

`separator` can be an `Iterable` or anything else as an element. If separator is an iterable, it will be searched as a sub iterator.

### Examples

```ts
import { splitLazy } from "split-lazy";

const arr = [1, 3, 5, 7, 9];
const result = splitLazy(arr, 5);

for (const item of result) {
    console.log(item);
}
// outputs:
// [1, 3]
// [7, 9]
```

```ts
import { splitLazy } from "split-lazy";

const arr = [1, 3, 5, 7, 9];
const iterable = splitLazy(arr, 5);

expect(iterable.next().value).toEqual([1, 3]); // ✅
expect(iterable.next().value).toEqual([7, 9]); // ✅
```

```ts
import { splitLazy } from "split-lazy";

function* generator() {
    yield 1;
    yield 3;
    yield 5;
    yield 7;
    yield 9;
}

const iterable = generator();
const result = splitLazy(iterable, 5);

for (const item of result) {
    console.log(item);
}
// outputs:
// [1, 3]
// [7, 9]
```

It can also search for sub-iterables in iterables:

```ts
import { splitLazy } from "split-lazy";

const arr = [1, 3, 5, 7, 9, 11];
const iterable = splitLazy(arr, [5, 7]);

expect(iterable.next().value).toEqual([1, 3]); // ✅
expect(iterable.next().value).toEqual([9, 11]); // ✅
```

## `asyncSplitLazy`

```ts
async function* asyncSplitLazy<I, T extends AsyncIterable<I>>(
  iterable: T,
  separator: unknown
): AsyncGenerator<I[], void, void>
```

Iterable can be an `AsyncIterable`. Separator can be an `Iterable`, `AsyncIterable` or anything else as an element. If `separator` is an iterable, it will be searched as a sub iterator.

Note that if `separator` argument is an `AsyncIterable`, `asyncSplitLazy` fully iterates the given separator before it starts searching for it in the first argument (`iterable`).

## Contributing

Help is needed for documentation in general. Adding/improving TSDoc, a better README, added/improved reference would be amazing 💫. Please open/find an issue to discuss. 

## Tests

Jest tests are set up to run with `npm test`.

[iterators]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
