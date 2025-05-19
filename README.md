# slice-tree

A `piece table` data structure implemented using `red-black tree`.

[![JSR](https://jsr.io/badges/@eu-ge-ne/slice-tree)](https://jsr.io/@eu-ge-ne/slice-tree)
[![JSR Score](https://jsr.io/badges/@eu-ge-ne/slice-tree/score)](https://jsr.io/@eu-ge-ne/slice-tree)
[![codecov](https://codecov.io/gh/eu-ge-ne/slice-tree/branch/main/graph/badge.svg?token=9CQ0V249XC)](https://codecov.io/gh/eu-ge-ne/slice-tree)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=eu-ge-ne_slice-tree&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=eu-ge-ne_slice-tree)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=eu-ge-ne_slice-tree&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=eu-ge-ne_slice-tree)

- [slice-tree](#slice-tree)
  - [Installation](#installation)
    - [Deno](#deno)
    - [Node.js](#nodejs)
    - [Bun](#bun)
  - [Examples](#examples)
  - [API](#api)
    - [`SliceTree()`](#slicetree)
    - [`SliceTree.prototype.count`](#slicetreeprototypecount)
    - [`SliceTree.prototype.line_count`](#slicetreeprototypeline_count)
    - [`SliceTree.prototype.read()`](#slicetreeprototyperead)
    - [`SliceTree.prototype.line_range()`](#slicetreeprototypeline_range)
    - [`SliceTree.prototype.line()`](#slicetreeprototypeline)
    - [`SliceTree.prototype.write()`](#slicetreeprototypewrite)
    - [`SliceTree.prototype.erase()`](#slicetreeprototypeerase)
  - [Benchmarks](#benchmarks)
    - [Create](#create)
    - [Write](#write)
    - [Erase](#erase)
  - [License](#license)

> In computing, a piece table is a data structure typically used to represent a
> text document while it is edited in a text editor. Initially a reference (or
> 'span') to the whole of the original file is created, which represents the as
> yet unchanged file. Subsequent inserts and deletes replace a span by
> combinations of one, two, or three references to sections of either the
> original document or to a buffer holding inserted text.

&mdash;
<cite>[Crowley, Charles (10 June 1998). "Data Structures for Text Sequences - 6.4 The piece table method"](https://web.archive.org/web/20180223071931/https://www.cs.unm.edu/~crowley/papers/sds.pdf)</cite>

## Installation

### Deno

```bash
deno add jsr:@eu-ge-ne/slice-tree
```

### Node.js

```bash
# pnpm
pnpm i jsr:@eu-ge-ne/slice-tree

# yarn
yarn add jsr:@eu-ge-ne/slice-tree

# npm
npx jsr add @eu-ge-ne/slice-tree
```

### Bun

```bash
bunx jsr add @eu-ge-ne/slice-tree
```

## Examples

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree();

assertEquals(text.count, 0);
assertEquals(text.line_count, 0);
assertEquals(text.read(0).toArray().join(""), "");
assertEquals(text.line(0).toArray().join(""), "");

text.write(0, "Lorem");

assertEquals(text.count, 5);
assertEquals(text.line_count, 1);
assertEquals(text.read(0).toArray().join(""), "Lorem");
assertEquals(text.line(0).toArray().join(""), "Lorem");

text.write(5, "ipsum");

assertEquals(text.count, 10);
assertEquals(text.line_count, 1);
assertEquals(text.read(0).toArray().join(""), "Loremipsum");
assertEquals(text.line(0).toArray().join(""), "Loremipsum");

text.write(5, "\n");
text.write(11, "\n");

assertEquals(text.count, 12);
assertEquals(text.line_count, 3);
assertEquals(text.read(0).toArray().join(""), "Lorem\nipsum\n");
assertEquals(text.line(0).toArray().join(""), "Lorem\n");
assertEquals(text.line(1).toArray().join(""), "ipsum\n");
assertEquals(text.line(2).toArray().join(""), "");

text.erase(0, 6);
text.erase(5, 1);

assertEquals(text.count, 5);
assertEquals(text.line_count, 1);
assertEquals(text.read(0).toArray().join(""), "ipsum");
assertEquals(text.line(0).toArray().join(""), "ipsum");
```

## API

### `SliceTree()`

Creates a `SliceTree` instance with optional initial text.

Syntax

```ts ignore
new SliceTree(text?: string)
```

### `SliceTree.prototype.count`

Returns the total number of characters in the text content.

Syntax

```ts ignore
get count(): number
```

Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree("Lorem ipsum");

assertEquals(text.count, 11);
```

### `SliceTree.prototype.line_count`

Returns the number of lines in the text content.

Syntax

```ts ignore
get line_count(): number
```

Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

assertEquals(text.line_count, 5);
```

### `SliceTree.prototype.read()`

Returns the text between the specified start (inclusive) and end (exclusive)
positions.

Syntax

```ts ignore
*read(start: number, end = Number.MAX_SAFE_INTEGER): Generator<string>
```

Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree("Lorem ipsum");

assertEquals(text.read(0).toArray().join(""), "Lorem ipsum");
```

### `SliceTree.prototype.line_range()`

Returns the start index (inclusive) and the end index (exclusive) of the line at
the specified index.

Syntax

```ts ignore
line_range(index: number): readonly [number, number | undefined] | undefined
```

Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree("Lorem\nipsum");

assertEquals(text.line_range(0), [0, 6]);
```

### `SliceTree.prototype.line()`

Returns the content of the line at the specified index.

Syntax

```ts ignore
*line(index: number): Generator<string>
```

Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

assertEquals(text.line(1).toArray().join(""), "ipsum\n");
```

### `SliceTree.prototype.write()`

Inserts the given text at the specified index in the content.

Syntax

```ts ignore
write(index: number, text: string): void
```

Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree();

text.write(0, "Lorem ipsum");

assertEquals(text.read(0).toArray().join(""), "Lorem ipsum");
```

### `SliceTree.prototype.erase()`

Removes the text in the range from index (inclusive) to index + count
(exclusive).

Syntax

```ts ignore
erase(index: number, count: number): void
```

Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree("Lorem ipsum");

text.erase(5, 6);

assertEquals(text.read(0).toArray().join(""), "Lorem");
```

## Benchmarks

### Create

```bash
❯ deno bench bench/create.bench.ts
Check file:///Users/eug/Dev/github.com/eu-ge-ne/slice-tree/bench/create.bench.ts
    CPU | Apple M4 Pro
Runtime | Deno 2.3.3 (aarch64-apple-darwin)

file:///Users/eug/Dev/github.com/eu-ge-ne/slice-tree/bench/create.bench.ts

benchmark              time/iter (avg)        iter/s      (min … max)           p75      p99     p995
---------------------- ----------------------------- --------------------- --------------------------

group Create
Creating a SliceTree          209.4 ns     4,776,000 (204.4 ns … 231.1 ns) 210.8 ns 218.3 ns 220.1 ns
Creating a string              88.2 ns    11,330,000 ( 86.6 ns … 102.7 ns)  88.6 ns  95.8 ns  99.6 ns

summary
  Creating a SliceTree
     2.37x slower than Creating a string
```

### Write

```bash
❯ deno bench bench/write.bench.ts
Check file:///Users/eug/Dev/github.com/eu-ge-ne/slice-tree/bench/write.bench.ts
    CPU | Apple M4 Pro
Runtime | Deno 2.3.3 (aarch64-apple-darwin)

file:///Users/eug/Dev/github.com/eu-ge-ne/slice-tree/bench/write.bench.ts

benchmark                                           time/iter (avg)        iter/s      (min … max)           p75      p99     p995
--------------------------------------------------- ----------------------------- --------------------- --------------------------

group Append x1000
Appending 1000 chars into a SliceTree                      288.0 µs         3,472 (278.0 µs … 370.5 µs) 286.0 µs 351.5 µs 355.0 µs
Appending 1000 chars into a string                          89.7 µs        11,150 ( 87.3 µs … 180.9 µs)  89.7 µs 126.6 µs 128.7 µs

summary
  Appending 1000 chars into a SliceTree
     3.21x slower than Appending 1000 chars into a string

group Append x10000
Appending 10000 chars into a SliceTree                       3.2 ms         307.8 (  3.1 ms …   4.0 ms)   3.3 ms   4.0 ms   4.0 ms
Appending 10000 chars into a string                        887.4 µs         1,127 (874.4 µs …   1.1 ms) 885.3 µs 969.5 µs   1.0 ms

summary
  Appending 10000 chars into a SliceTree
     3.66x slower than Appending 10000 chars into a string

group Append x100000
Appending 100000 chars into a SliceTree                     37.1 ms          26.9 ( 35.6 ms …  42.8 ms)  37.2 ms  42.8 ms  42.8 ms
Appending 100000 chars into a string                         9.1 ms         110.3 (  8.8 ms …  10.6 ms)   8.9 ms  10.6 ms  10.6 ms

summary
  Appending 100000 chars into a SliceTree
     4.10x slower than Appending 100000 chars into a string

group Write sequential x100
Writing 100 chars sequentially into a SliceTree             27.4 µs        36,500 ( 26.3 µs … 248.5 µs)  27.4 µs  32.4 µs  34.3 µs
Writing 100 chars sequentially into a string                19.1 µs        52,310 ( 18.0 µs … 163.2 µs)  19.0 µs  23.4 µs  26.2 µs

summary
  Writing 100 chars sequentially into a SliceTree
     1.43x slower than Writing 100 chars sequentially into a string

group Write sequential x1000
Writing 1000 chars sequentially into a SliceTree           306.5 µs         3,262 (298.0 µs … 563.7 µs) 308.1 µs 362.2 µs 417.5 µs
Writing 1000 chars sequentially into a string                1.1 ms         885.5 (726.6 µs …   1.6 ms)   1.3 ms   1.5 ms   1.5 ms

summary
  Writing 1000 chars sequentially into a SliceTree
     3.68x faster than Writing 1000 chars sequentially into a string

group Write sequential x10000
Writing 10000 chars sequentially into a SliceTree            3.5 ms         284.8 (  3.4 ms …   4.0 ms)   3.5 ms   3.9 ms   4.0 ms
Writing 10000 chars sequentially into a string             283.1 ms           3.5 (271.2 ms … 297.1 ms) 285.4 ms 297.1 ms 297.1 ms

summary
  Writing 10000 chars sequentially into a SliceTree
    80.63x faster than Writing 10000 chars sequentially into a string

group Write interleaved x100
Writing 100 chars interleaved into a SliceTree              44.9 µs        22,250 ( 43.6 µs … 829.9 µs)  44.8 µs  50.2 µs  51.7 µs
Writing 100 chars interleaved into a string                 19.8 µs        50,620 ( 18.2 µs … 150.2 µs)  19.8 µs  24.2 µs  26.7 µs

summary
  Writing 100 chars interleaved into a SliceTree
     2.27x slower than Writing 100 chars interleaved into a string

group Write interleaved x1000
Writing 1000 chars interleaved into a SliceTree            565.1 µs         1,769 (553.8 µs … 869.4 µs) 565.3 µs 692.3 µs 708.3 µs
Writing 1000 chars interleaved into a string                 1.4 ms         719.0 (821.7 µs …   1.9 ms)   1.6 ms   1.8 ms   1.9 ms

summary
  Writing 1000 chars interleaved into a SliceTree
     2.46x faster than Writing 1000 chars interleaved into a string

group Write interleaved x10000
Writing 10000 chars interleaved into a SliceTree             6.9 ms         144.4 (  6.8 ms …   7.4 ms)   6.9 ms   7.4 ms   7.4 ms
Writing 10000 chars interleaved into a string              299.2 ms           3.3 (295.7 ms … 302.1 ms) 300.7 ms 302.1 ms 302.1 ms

summary
  Writing 10000 chars interleaved into a SliceTree
    43.20x faster than Writing 10000 chars interleaved into a string
```

### Erase

```bash
❯ deno bench bench/erase.bench.ts
    CPU | Apple M4 Pro
Runtime | Deno 2.3.3 (aarch64-apple-darwin)

file:///Users/eug/Dev/github.com/eu-ge-ne/slice-tree/bench/erase.bench.ts

benchmark                                             time/iter (avg)        iter/s      (min … max)           p75      p99     p995
----------------------------------------------------- ----------------------------- --------------------- --------------------------

group Erase sequential x10000
Erasing 10000 chars sequentially from a SliceTree              1.6 ms         639.7 (  1.5 ms …   2.0 ms)   1.6 ms   1.8 ms   1.9 ms
Erasing 10000 chars sequentially from a string                38.7 µs        25,870 ( 36.8 µs … 118.9 µs)  37.7 µs  73.6 µs  75.8 µs

summary
  Erasing 10000 chars sequentially from a SliceTree
    40.44x slower than Erasing 10000 chars sequentially from a string

group Erase sequential x100000
Erasing 100000 chars sequentially from a SliceTree            20.4 ms          49.1 ( 19.7 ms …  21.4 ms)  20.8 ms  21.4 ms  21.4 ms
Erasing 100000 chars sequentially from a string              387.4 µs         2,581 (369.2 µs … 661.1 µs) 401.4 µs 484.2 µs 648.0 µs

summary
  Erasing 100000 chars sequentially from a SliceTree
    52.54x slower than Erasing 100000 chars sequentially from a string

group Erase sequential x1000000
Erasing 1000000 chars sequentially from a SliceTree          269.8 ms           3.7 (259.8 ms … 277.8 ms) 273.4 ms 277.8 ms 277.8 ms
Erasing 1000000 chars sequentially from a string               3.9 ms         257.6 (  3.8 ms …   5.0 ms)   3.9 ms   5.0 ms   5.0 ms

summary
  Erasing 1000000 chars sequentially from a SliceTree
    69.52x slower than Erasing 1000000 chars sequentially from a string
```

## License

[MIT](https://choosealicense.com/licenses/mit)
