**Note: This repository is outdated and archived. The development continues in the [text-buf](https://github.com/eu-ge-ne/text-buf) repository.**

<hr />

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
    - [`SliceTree:count`](#slicetreecount)
    - [`SliceTree:line_count`](#slicetreeline_count)
    - [`SliceTree.proto.read()`](#slicetreeprotoread)
    - [`SliceTree.proto.write()`](#slicetreeprotowrite)
    - [`SliceTree.proto.erase()`](#slicetreeprotoerase)
  - [Benchmarks](#benchmarks)
    - [Create](#create)
    - [Write](#write)
    - [Erase](#erase)
    - [Line](#line)
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
assertEquals(text.read(0), undefined);

text.write(0, "Lorem");

assertEquals(text.count, 5);
assertEquals(text.line_count, 1);
assertEquals(text.read(0), "Lorem");

text.write(5, "ipsum");

assertEquals(text.count, 10);
assertEquals(text.line_count, 1);
assertEquals(text.read(0), "Loremipsum");

text.write(5, "\n");
text.write(11, "\n");

assertEquals(text.count, 12);
assertEquals(text.line_count, 3);
assertEquals(text.read(0), "Lorem\nipsum\n");
assertEquals(text.read([0, 0], [1, 0]), "Lorem\n");
assertEquals(text.read([1, 0], [2, 0]), "ipsum\n");
assertEquals(text.read([2, 0], [3, 0]), undefined);

text.erase(0, 6);
text.erase(5, 6);

assertEquals(text.count, 5);
assertEquals(text.line_count, 1);
assertEquals(text.read(0), "ipsum");
assertEquals(text.read([0, 0], [1, 0]), "ipsum");
```

## API

### `SliceTree()`

Creates instance of `SliceTree` interpreting text characters as
`UTF-16 code units`. Visit
[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#utf-16_characters_unicode_code_points_and_grapheme_clusters)
for more details. Accepts optional initial text.

Syntax

```ts ignore
new SliceTree(text?: string)
```

### `SliceTree:count`

Returns number of characters in the buffer.

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

### `SliceTree:line_count`

Returns number of lines in the buffer.

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

### `SliceTree.proto.read()`

Returns text in the buffer's section, specified by start (inclusive) and end
(exclusive) positions.

Syntax

```ts ignore
read(start: Position, end?: Position): string
```

Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree("Lorem\nipsum");

assertEquals(text.read(0), "Lorem\nipsum");
assertEquals(text.read(6), "ipsum");
assertEquals(text.read([0, 0], [1, 0]), "Lorem\n");
assertEquals(text.read([1, 0], [2, 0]), "ipsum");
```

### `SliceTree.proto.write()`

Inserts text into the buffer at the specified position.

Syntax

```ts ignore
write(position: Position, text: string): void
```

Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree();

text.write(0, "Lorem");
text.write([0, 5], " ipsum");

assertEquals(text.read(0), "Lorem ipsum");
```

### `SliceTree.proto.erase()`

Removes characters in the buffer's section, specified by start (inclusive) and
end (exclusive) positions.

Syntax

```ts ignore
erase(start: Position, end?: Position): void
```

Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree("Lorem ipsum");

text.erase(5, 11);

assertEquals(text.read(0), "Lorem");
```

## Benchmarks

### Create

```bash
❯ deno bench bench/create.bench.ts
    CPU | Apple M4 Pro
Runtime | Deno 2.3.3 (aarch64-apple-darwin)

file:///Users/eug/Dev/github.com/eu-ge-ne/slice-tree/bench/create.bench.ts

benchmark              time/iter (avg)        iter/s      (min … max)           p75      p99     p995
---------------------- ----------------------------- --------------------- --------------------------

group Create
Creating a SliceTree            2.8 ms         354.4 (  2.7 ms …   3.7 ms)   2.9 ms   3.7 ms   3.7 ms
Creating a string               2.5 ms         396.4 (  2.4 ms …   3.1 ms)   2.5 ms   3.1 ms   3.1 ms

summary
  Creating a SliceTree
     1.12x slower than Creating a string
```

### Write

```bash
❯ deno bench bench/write.bench.ts
Check file:///Users/eug/Dev/github.com/eu-ge-ne/slice-tree/bench/write.bench.ts
    CPU | Apple M4 Pro
Runtime | Deno 2.3.3 (aarch64-apple-darwin)

file:///Users/eug/Dev/github.com/eu-ge-ne/slice-tree/bench/write.bench.ts

benchmark                          time/iter (avg)        iter/s      (min … max)           p75      p99     p995
---------------------------------- ----------------------------- --------------------- --------------------------

group Append
Appending into a SliceTree                 28.8 ms          34.7 ( 26.7 ms …  33.8 ms)  29.7 ms  33.8 ms  33.8 ms
Appending into a string                     9.4 ms         106.7 (  9.2 ms …  10.5 ms)   9.4 ms  10.5 ms  10.5 ms

summary
  Appending into a SliceTree
     3.08x slower than Appending into a string

group Insert
Inserting into a SliceTree                 87.3 ms          11.5 ( 84.2 ms …  89.1 ms)  88.5 ms  89.1 ms  89.1 ms
Inserting 1M chars into a string             1.7 s           0.6 (   1.6 s …    1.8 s)    1.7 s    1.8 s    1.8 s

summary
  Inserting into a SliceTree
    19.22x faster than Inserting 1M chars into a string
```

### Erase

```bash
❯ deno bench bench/erase.bench.ts
Check file:///Users/eug/Dev/github.com/eu-ge-ne/slice-tree/bench/erase.bench.ts
    CPU | Apple M4 Pro
Runtime | Deno 2.3.3 (aarch64-apple-darwin)

file:///Users/eug/Dev/github.com/eu-ge-ne/slice-tree/bench/erase.bench.ts

benchmark                   time/iter (avg)        iter/s      (min … max)           p75      p99     p995
--------------------------- ----------------------------- --------------------- --------------------------

group Trim
Trimming a SliceTree               637.3 µs         1,569 (577.0 µs …   1.1 ms) 680.8 µs 939.8 µs   1.0 ms
Trimming a string                  391.3 µs         2,556 (368.8 µs … 759.8 µs) 397.0 µs 674.5 µs 703.6 µs

summary
  Trimming a SliceTree
     1.63x slower than Trimming a string

group Delete
Deleting from a SliceTree           20.9 ms          47.9 ( 20.3 ms …  22.0 ms)  21.2 ms  22.0 ms  22.0 ms
Deleting from a string             167.7 ms           6.0 (166.9 ms … 169.3 ms) 167.8 ms 169.3 ms 169.3 ms

summary
  Deleting from a SliceTree
     8.03x faster than Deleting from a string
```

### Line

```bash
❯ deno bench bench/line.bench.ts
    CPU | Apple M4 Pro
Runtime | Deno 2.3.3 (aarch64-apple-darwin)

file:///Users/eug/Dev/github.com/eu-ge-ne/slice-tree/bench/line.bench.ts

benchmark                         time/iter (avg)        iter/s      (min … max)           p75      p99     p995
--------------------------------- ----------------------------- --------------------- --------------------------

group Line
Accessing a line in a SliceTree          157.9 µs         6,332 (145.3 µs … 281.0 µs) 152.6 µs 224.6 µs 234.8 µs
Accessing a line in a string              40.4 ms          24.8 ( 39.4 ms …  44.1 ms)  40.5 ms  44.1 ms  44.1 ms

summary
  Accessing a line in a SliceTree
   255.80x faster than Accessing a line in a string
```

## License

[MIT](https://choosealicense.com/licenses/mit)
