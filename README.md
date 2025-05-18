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
    - [Append](#append)
    - [Insert](#insert)
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

### Append

```bash
❯ deno bench bench/append.bench.ts
    CPU | Apple M4 Pro
Runtime | Deno 2.3.3 (aarch64-apple-darwin)

file:///Users/eug/Dev/github.com/eu-ge-ne/slice-tree/bench/append.bench.ts

benchmark                                 time/iter (avg)        iter/s      (min … max)           p75      p99     p995
----------------------------------------- ----------------------------- --------------------- --------------------------

group Append x1000
Appending 1000 chars into a SliceTree            284.7 µs         3,512 (274.6 µs … 531.6 µs) 282.2 µs 352.8 µs 360.5 µs
Appending 1000 chars into a string                89.3 µs        11,200 ( 86.9 µs … 184.2 µs)  89.2 µs 125.5 µs 127.8 µs

summary
  Appending 1000 chars into a SliceTree
     3.19x slower than Appending 1000 chars into a string

group Append x10000
Appending 10000 chars into a SliceTree             3.3 ms         307.1 (  3.1 ms …   3.8 ms)   3.3 ms   3.8 ms   3.8 ms
Appending 10000 chars into a string              884.3 µs         1,131 (872.5 µs …   1.2 ms) 884.7 µs 967.8 µs 985.8 µs

summary
  Appending 10000 chars into a SliceTree
     3.68x slower than Appending 10000 chars into a string

group Append x100000
Appending 100000 chars into a SliceTree           36.9 ms          27.1 ( 35.2 ms …  40.6 ms)  37.5 ms  40.6 ms  40.6 ms
Appending 100000 chars into a string               9.0 ms         111.6 (  8.7 ms …  10.5 ms)   8.8 ms  10.5 ms  10.5 ms

summary
  Appending 100000 chars into a SliceTree
     4.12x slower than Appending 100000 chars into a string
```

### Insert

```bash
❯ deno bench bench/insert.bench.ts
    CPU | Apple M4 Pro
Runtime | Deno 2.3.3 (aarch64-apple-darwin)

file:///Users/eug/Dev/github.com/eu-ge-ne/slice-tree/bench/insert.bench.ts

benchmark                                             time/iter (avg)        iter/s      (min … max)           p75      p99     p995
----------------------------------------------------- ----------------------------- --------------------- --------------------------

group Insert sequential x100
Inserting 100 chars sequentially into a SliceTree             28.0 µs        35,750 ( 26.7 µs …  98.1 µs)  27.7 µs  56.8 µs  59.3 µs
Inserting 100 chars sequentially into a string                19.7 µs        50,850 ( 17.8 µs … 128.0 µs)  18.7 µs  47.2 µs  48.0 µs

summary
  Inserting 100 chars sequentially into a SliceTree
     1.42x slower than Inserting 100 chars sequentially into a string

group Insert interleaved x100
Inserting 100 chars interleaved into a SliceTree              45.2 µs        22,150 ( 43.7 µs … 139.7 µs)  45.0 µs  50.7 µs  77.4 µs
Inserting 100 chars interleaved into a string                 19.6 µs        51,080 ( 18.1 µs …  71.6 µs)  19.0 µs  48.7 µs  49.0 µs

summary
  Inserting 100 chars interleaved into a SliceTree
     2.31x slower than Inserting 100 chars interleaved into a string

group Insert sequential x1000
Inserting 1000 chars sequentially into a SliceTree           313.5 µs         3,189 (301.2 µs … 421.5 µs) 313.8 µs 386.8 µs 399.8 µs
Inserting 1000 chars sequentially into a string              706.8 µs         1,415 (664.7 µs …   1.9 ms) 722.2 µs 850.0 µs   1.2 ms

summary
  Inserting 1000 chars sequentially into a SliceTree
     2.25x faster than Inserting 1000 chars sequentially into a string

group Insert interleaved x1000
Inserting 1000 chars interleaved into a SliceTree            571.9 µs         1,749 (560.9 µs … 714.2 µs) 574.4 µs 630.2 µs 636.5 µs
Inserting 1000 chars interleaved into a string               781.1 µs         1,280 (734.5 µs … 981.5 µs) 799.4 µs 852.0 µs 866.2 µs

summary
  Inserting 1000 chars interleaved into a SliceTree
     1.37x faster than Inserting 1000 chars interleaved into a string

group Insert sequential x10000
Inserting 10000 chars sequentially into a SliceTree            3.6 ms         274.8 (  3.5 ms …   4.3 ms)   3.7 ms   4.3 ms   4.3 ms
Inserting 10000 chars sequentially into a string             300.2 ms           3.3 (293.4 ms … 306.1 ms) 303.0 ms 306.1 ms 306.1 ms

summary
  Inserting 10000 chars sequentially into a SliceTree
    82.51x faster than Inserting 10000 chars sequentially into a string

group Insert interleaved x10000
Inserting 10000 chars interleaved into a SliceTree             6.9 ms         144.4 (  6.8 ms …   8.2 ms)   6.9 ms   8.2 ms   8.2 ms
Inserting 10000 chars interleaved into a string              305.7 ms           3.3 (296.3 ms … 312.3 ms) 308.4 ms 312.3 ms 312.3 ms

summary
  Inserting 10000 chars interleaved into a SliceTree
    44.13x faster than Inserting 10000 chars interleaved into a string
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
