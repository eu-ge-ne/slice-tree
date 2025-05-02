# slice-tree

[![JSR](https://jsr.io/badges/@eu-ge-ne/slice-tree)](https://jsr.io/@eu-ge-ne/slice-tree)
[![JSR Score](https://jsr.io/badges/@eu-ge-ne/slice-tree/score)](https://jsr.io/@eu-ge-ne/slice-tree)
[![codecov](https://codecov.io/gh/eu-ge-ne/slice-tree/branch/main/graph/badge.svg?token=9CQ0V249XC)](https://codecov.io/gh/eu-ge-ne/slice-tree)

A piece table data structure implemented using Red-Black trees.

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

### Instance properties

#### `count`

The total number of characters in the text content.
[JSR Docs](https://jsr.io/@eu-ge-ne/slice-tree/doc/~/SliceTree.prototype.count)

#### `line_count`

The number of lines in the text content.
[JSR Docs](https://jsr.io/@eu-ge-ne/slice-tree/doc/~/SliceTree.prototype.line_count)

### Instance methods

#### `read(start, end)`

Returns the text from the content between the specified start and end positions,
without modifying the original content.
[JSR Docs](https://jsr.io/@eu-ge-ne/slice-tree/doc/~/SliceTree.prototype.read)

#### `line(index)`

Returns the content of the line at the specified index, without modifying the
original content.
[JSR Docs](https://jsr.io/@eu-ge-ne/slice-tree/doc/~/SliceTree.prototype.line)

#### `write(index, text)`

Inserts the text into the content at the specified index.
[JSR Docs](https://jsr.io/@eu-ge-ne/slice-tree/doc/~/SliceTree.prototype.write)

#### `erase(start, end)`

Removes the text in the range between start and end from the content.
[JSR Docs](https://jsr.io/@eu-ge-ne/slice-tree/doc/~/SliceTree.prototype.erase)

## License

[MIT](https://choosealicense.com/licenses/mit)
