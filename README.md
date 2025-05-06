# slice-tree

[![JSR](https://jsr.io/badges/@eu-ge-ne/slice-tree)](https://jsr.io/@eu-ge-ne/slice-tree)
[![JSR Score](https://jsr.io/badges/@eu-ge-ne/slice-tree/score)](https://jsr.io/@eu-ge-ne/slice-tree)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=eu-ge-ne_slice-tree&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=eu-ge-ne_slice-tree)
[![codecov](https://codecov.io/gh/eu-ge-ne/slice-tree/branch/main/graph/badge.svg?token=9CQ0V249XC)](https://codecov.io/gh/eu-ge-ne/slice-tree)

A `piece table` data structure implemented using `red-black tree`.

> In computing, a piece table is a data structure typically used to represent a
> text document while it is edited in a text editor. Initially a reference (or
> 'span') to the whole of the original file is created, which represents the as
> yet unchanged file. Subsequent inserts and deletes replace a span by
> combinations of one, two, or three references to sections of either the
> original document or to a buffer holding inserted text.

&mdash;
<cite>[Crowley, Charles (10 June 1998). "Data Structures for Text Sequences - 6.4 The piece table method"](https://web.archive.org/web/20180223071931/https://www.cs.unm.edu/~crowley/papers/sds.pdf)</cite>

## Example

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

### Properties

#### `SliceTree.prototype.count`

Returns the total number of characters in the text content.

#### Syntax

```ts ignore
get count(): number
```

#### Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree();

text.write(0, "Lorem ipsum");

assertEquals(text.count, 11);
```

---

#### `SliceTree.prototype.line_count`

Returns the number of lines in the text content.

#### Syntax

```ts ignore
get line_count(): number
```

#### Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree();

text.write(0, "Lorem\nipsum\ndolor\nsit\namet");

assertEquals(text.line_count, 5);
```

### Methods

#### `SliceTree.prototype.read`

Returns the text between the specified start (inclusive) and end (exclusive)
positions, without modifying the content.

#### Syntax

```ts ignore
*read(start: number, end = Number.MAX_SAFE_INTEGER): Generator<string>
```

#### Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree();

text.write(0, "Lorem ipsum");

assertEquals(text.read(0).toArray().join(""), "Lorem ipsum");
```

---

#### `SliceTree.prototype.line`

Returns the content of the line at the specified index, without modifying the
content.

#### Syntax

```ts ignore
*line(index: number): Generator<string>
```

#### Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree();

text.write(0, "Lorem\nipsum\ndolor\nsit\namet");

assertEquals(text.line(1).toArray().join(""), "ipsum\n");
```

---

#### `SliceTree.prototype.write`

Inserts the given text at the specified index in the content.

#### Syntax

```ts ignore
write(index: number, text: string): void
```

#### Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree();

text.write(0, "Lorem ipsum");

assertEquals(text.read(0).toArray().join(""), "Lorem ipsum");
```

---

#### `SliceTree.prototype.erase`

Removes the text in the range from index (inclusive) to index + count
(exclusive).

#### Syntax

```ts ignore
erase(index: number, count: number): void
```

#### Example

```ts
import { assertEquals } from "jsr:@std/assert";
import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";

const text = new SliceTree();

text.write(0, "Lorem ipsum");
text.erase(5, 6);

assertEquals(text.read(0).toArray().join(""), "Lorem");
```

## License

[MIT](https://choosealicense.com/licenses/mit)
