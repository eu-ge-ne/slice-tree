# slice-tree

[![JSR](https://jsr.io/badges/@eu-ge-ne/slice-tree)](https://jsr.io/@eu-ge-ne/slice-tree)
[![codecov](https://codecov.io/gh/eu-ge-ne/slice-tree/branch/main/graph/badge.svg?token=9CQ0V249XC)](https://codecov.io/gh/eu-ge-ne/slice-tree)

A piece table data structure implemented using Red-Black trees.

## API

### Instance properties

#### `count`

The total number of characters in the string content.

#### `line_count`

The number of lines in the string content.

### Instance methods

#### `read(start, end)`

Returns a substring from the content between the specified start and end
positions, without modifying the original content.

#### `line(index)`

Returns the content of the line at the specified index, without modifying the
original content.

#### `write(index, text)`

Inserts text into the content at the specified index.

#### `erase(start, end)`

Removes characters in the range between start and end from the content.

## License

[MIT](https://choosealicense.com/licenses/mit)
