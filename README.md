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
    - [Sequential removal](#sequential-removal)
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

benchmark                                             time/iter (avg)        iter/s      (min … max)           p75      p99     p995
----------------------------------------------------- ----------------------------- --------------------- --------------------------

group Append x1000
Appending 1000 chars into a SliceTree                        283.8 µs         3,524 (274.1 µs … 403.4 µs) 281.0 µs 348.2 µs 354.0 µs
Appending 1000 chars into a string                            88.3 µs        11,320 ( 86.3 µs … 161.7 µs)  88.3 µs 125.4 µs 127.0 µs

summary
  Appending 1000 chars into a SliceTree
     3.21x slower than Appending 1000 chars into a string

group Append x10000
Appending 10000 chars into a SliceTree                         3.3 ms         302.1 (  3.1 ms …   4.4 ms)   3.4 ms   4.3 ms   4.4 ms
Appending 10000 chars into a string                          892.6 µs         1,120 (872.5 µs …   1.1 ms) 893.1 µs 980.3 µs   1.0 ms

summary
  Appending 10000 chars into a SliceTree
     3.71x slower than Appending 10000 chars into a string

group Append x100000
Appending 100000 chars into a SliceTree                       37.1 ms          27.0 ( 35.3 ms …  42.5 ms)  37.2 ms  42.5 ms  42.5 ms
Appending 100000 chars into a string                           9.0 ms         111.0 (  8.7 ms …  10.8 ms)   8.8 ms  10.8 ms  10.8 ms

summary
  Appending 100000 chars into a SliceTree
     4.12x slower than Appending 100000 chars into a string

group Insert sequential x100
Inserting 100 chars sequentially into a SliceTree             27.7 µs        36,110 ( 26.5 µs … 197.2 µs)  27.8 µs  33.3 µs  34.7 µs
Inserting 100 chars sequentially into a string                19.0 µs        52,730 ( 17.8 µs … 134.5 µs)  18.9 µs  22.8 µs  25.4 µs

summary
  Inserting 100 chars sequentially into a SliceTree
     1.46x slower than Inserting 100 chars sequentially into a string

group Insert sequential x1000
Inserting 1000 chars sequentially into a SliceTree           310.3 µs         3,222 (301.3 µs … 492.7 µs) 310.7 µs 388.2 µs 423.8 µs
Inserting 1000 chars sequentially into a string                1.1 ms         931.8 (724.4 µs …   1.6 ms)   1.3 ms   1.5 ms   1.5 ms

summary
  Inserting 1000 chars sequentially into a SliceTree
     3.46x faster than Inserting 1000 chars sequentially into a string

group Insert sequential x10000
Inserting 10000 chars sequentially into a SliceTree            3.6 ms         278.2 (  3.4 ms …   4.1 ms)   3.6 ms   3.9 ms   4.1 ms
Inserting 10000 chars sequentially into a string             297.7 ms           3.4 (271.3 ms … 315.0 ms) 303.5 ms 315.0 ms 315.0 ms

summary
  Inserting 10000 chars sequentially into a SliceTree
    82.84x faster than Inserting 10000 chars sequentially into a string

group Insert interleaved x100
Inserting 100 chars interleaved into a SliceTree              44.7 µs        22,380 ( 43.5 µs … 235.3 µs)  44.6 µs  49.8 µs  55.8 µs
Inserting 100 chars interleaved into a string                 19.5 µs        51,370 ( 18.2 µs … 145.3 µs)  19.5 µs  23.7 µs  26.5 µs

summary
  Inserting 100 chars interleaved into a SliceTree
     2.30x slower than Inserting 100 chars interleaved into a string

group Insert interleaved x1000
Inserting 1000 chars interleaved into a SliceTree            563.6 µs         1,774 (551.9 µs … 811.5 µs) 563.6 µs 663.5 µs 715.0 µs
Inserting 1000 chars interleaved into a string                 1.1 ms         881.5 (814.7 µs …   2.0 ms)   1.5 ms   1.7 ms   1.8 ms

summary
  Inserting 1000 chars interleaved into a SliceTree
     2.01x faster than Inserting 1000 chars interleaved into a string

group Insert interleaved x10000
Inserting 10000 chars interleaved into a SliceTree             6.9 ms         144.9 (  6.8 ms …   7.4 ms)   6.9 ms   7.4 ms   7.4 ms
Inserting 10000 chars interleaved into a string              313.3 ms           3.2 (304.4 ms … 320.7 ms) 316.3 ms 320.7 ms 320.7 ms

summary
  Inserting 10000 chars interleaved into a SliceTree
    45.39x faster than Inserting 10000 chars interleaved into a string
```

### Sequential removal

Removing sequentially from a SliceTree is 50x slower than removing from a
string.

```bash
❯ deno bench bench/removal-seq.bench.ts
    CPU | Apple M4 Pro
Runtime | Deno 2.3.3 (aarch64-apple-darwin)

file:///Users/eug/Dev/github.com/eu-ge-ne/slice-tree/bench/removal-seq.bench.ts

benchmark                                              time/iter (avg)        iter/s      (min … max)           p75      p99     p995
------------------------------------------------------ ----------------------------- --------------------- --------------------------

group Removal sequential x10000
Removing 10000 chars sequentially from a SliceTree              1.6 ms         638.6 (  1.5 ms …   1.9 ms)   1.6 ms   1.8 ms   1.8 ms
Removing 10000 chars sequentially from a string                39.5 µs        25,310 ( 37.6 µs … 133.5 µs)  38.2 µs  75.4 µs  80.9 µs

summary
  Removing 10000 chars sequentially from a SliceTree
    39.63x slower than Removing 10000 chars sequentially from a string

group Removal sequential x100000
Removing 100000 chars sequentially from a SliceTree            20.2 ms          49.5 ( 19.6 ms …  21.2 ms)  20.4 ms  21.2 ms  21.2 ms
Removing 100000 chars sequentially from a string              387.0 µs         2,584 (369.7 µs … 661.5 µs) 398.6 µs 474.0 µs 647.3 µs

summary
  Removing 100000 chars sequentially from a SliceTree
    52.20x slower than Removing 100000 chars sequentially from a string

group Removal sequential x1000000
Removing 1000000 chars sequentially from a SliceTree          278.8 ms           3.6 (257.0 ms … 303.5 ms) 290.0 ms 303.5 ms 303.5 ms
Removing 1000000 chars sequentially from a string               3.9 ms         257.1 (  3.8 ms …   4.8 ms)   3.9 ms   4.8 ms   4.8 ms

summary
  Removing 1000000 chars sequentially from a SliceTree
    71.68x slower than Removing 1000000 chars sequentially from a string
```

## License

[MIT](https://choosealicense.com/licenses/mit)
