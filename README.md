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
    - [`SliceTree.proto.read_line()`](#slicetreeprotoread_line)
    - [`SliceTree.proto.read_from_line()`](#slicetreeprotoread_from_line)
    - [`SliceTree.proto.write()`](#slicetreeprotowrite)
    - [`SliceTree.proto.write_line()`](#slicetreeprotowrite_line)
    - [`SliceTree.proto.erase()`](#slicetreeprotoerase)
    - [`SliceTree.proto.erase_line()`](#slicetreeprotoerase_line)
    - [`SliceTree.proto.find_line()`](#slicetreeprotofind_line)
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
assertEquals(text.read(0).toArray().join(""), "");
assertEquals(text.read_line(0).toArray().join(""), "");

text.write(0, "Lorem");

assertEquals(text.count, 5);
assertEquals(text.line_count, 1);
assertEquals(text.read(0).toArray().join(""), "Lorem");
assertEquals(text.read_line(0).toArray().join(""), "Lorem");

text.write(5, "ipsum");

assertEquals(text.count, 10);
assertEquals(text.line_count, 1);
assertEquals(text.read(0).toArray().join(""), "Loremipsum");
assertEquals(text.read_line(0).toArray().join(""), "Loremipsum");

text.write(5, "\n");
text.write(11, "\n");

assertEquals(text.count, 12);
assertEquals(text.line_count, 3);
assertEquals(text.read(0).toArray().join(""), "Lorem\nipsum\n");
assertEquals(text.read_line(0).toArray().join(""), "Lorem\n");
assertEquals(text.read_line(1).toArray().join(""), "ipsum\n");
assertEquals(text.read_line(2).toArray().join(""), "");

text.erase(0, 6);
text.erase(5, 6);

assertEquals(text.count, 5);
assertEquals(text.line_count, 1);
assertEquals(text.read(0).toArray().join(""), "ipsum");
assertEquals(text.read_line(0).toArray().join(""), "ipsum");
```

## API

### `SliceTree()`

Creates a `SliceTree` instance with optional initial text.

Syntax

```ts ignore
new SliceTree(text?: string)
```

### `SliceTree:count`

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

### `SliceTree:line_count`

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

### `SliceTree.proto.read()`

Returns the content starting at the specified index.

Syntax

```ts ignore
*read(index: number): Generator<string>
```

Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree("Lorem ipsum");

assertEquals(text.read(0).toArray().join(""), "Lorem ipsum");
```

### `SliceTree.proto.read_line()`

Returns the content of the line at the specified index.

Syntax

```ts ignore
*read_line(index: number, stop_at_eol = false): Generator<string>
```

Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

assertEquals(text.read_line(1).toArray().join(""), "ipsum\n");
```

### `SliceTree.proto.read_from_line()`

Returns the content starting at the specified line index.

Syntax

```ts ignore
*read_from_line(index: number): Generator<string>
```

Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

assertEquals(
  text.read_from_line(1).toArray().join(""),
  "ipsum\ndolor\nsit\namet",
);
```

### `SliceTree.proto.write()`

Inserts the text at the specified index in the content.

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

### `SliceTree.proto.write_line()`

Inserts the text at the specified column in the specified line.

Syntax

```ts ignore
write_line(line_index: number, column_index: number, text: string): void
```

### `SliceTree.proto.erase()`

Removes the text starting at the specified index.

Syntax

```ts ignore
erase(index: number, count = Number.MAX_SAFE_INTEGER): void
```

Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree("Lorem ipsum");

text.erase(5, 6);

assertEquals(text.read(0).toArray().join(""), "Lorem");
```

### `SliceTree.proto.erase_line()`

Removes the line at the specified index.

Syntax

```ts ignore
erase_line(line_index: number): void
```

### `SliceTree.proto.find_line()`

Returns the start index (inclusive) and the end index (exclusive) of the line at
the specified index.

Syntax

```ts ignore
find_line(line_index: number): readonly [number, number] | undefined
```

Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree("Lorem\nipsum");

assertEquals(text.find_line(0), [0, 6]);
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
