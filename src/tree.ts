import { delete_node } from "./deletion.ts";
import { insert_left, insert_right, InsertionCase } from "./insertion.ts";
import { bubble_update, iter, NIL, node_from_text } from "./node.ts";
import { find_eol, find_node, successor } from "./querying.ts";
import {
  new_grapheme_reader,
  new_point_reader,
  new_unit_reader,
  type Reader,
} from "./reader.ts";
import {
  grow_slice,
  slice_growable,
  trim_slice_end,
  trim_slice_start,
} from "./slice.ts";
import { split } from "./splitting.ts";

export type Index = number | readonly [number, number];

/**
 * Implements `piece table` data structure to represent text buffer.
 */
export class SliceTree {
  #reader: Reader;

  /**
   * @ignore
   * @internal
   */
  root = NIL;

  private constructor(reader: Reader, text?: string) {
    this.#reader = reader;

    if (text && text.length > 0) {
      this.root = node_from_text(reader, text);
      this.root.red = false;
    }
  }

  /**
   * Creates an instance of `SliceTree` interpreting text characters as `UTF-16 code units`. Visit [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#utf-16_characters_unicode_code_points_and_grapheme_clusters) for more details. Accepts optional initial text.
   *
   * @param `text` Initial text.
   * @returns `SliceTree` instance.
   */
  static units(text?: string): SliceTree {
    return new SliceTree(new_unit_reader(), text);
  }

  /**
   * Creates an instance of `SliceTree` interpreting text characters as `Unicode code points`. Visit [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#utf-16_characters_unicode_code_points_and_grapheme_clusters) for more details. Accepts optional initial text.
   *
   * @param `text` Initial text.
   * @returns `SliceTree` instance.
   */
  static points(text?: string): SliceTree {
    return new SliceTree(new_point_reader(), text);
  }

  /**
   * Creates an instance of `SliceTree` interpreting text characters as `Unicode graphemes`. Visit [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#utf-16_characters_unicode_code_points_and_grapheme_clusters) for more details. Accepts optional initial text.
   *
   * @param `text` Initial text.
   * @returns `SliceTree` instance.
   */
  static graphemes(text?: string): SliceTree {
    return new SliceTree(new_grapheme_reader(), text);
  }

  /**
   * Returns the number of characters in the text buffer.
   *
   * @returns Number of characters.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = SliceTree.units("Lorem ipsum");
   *
   * assertEquals(text.count, 11);
   * ```
   */
  get count(): number {
    return this.root.len;
  }

  /**
   * Returns the number of lines in the text buffer.
   *
   * @returns Number of lines.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = SliceTree.units("Lorem\nipsum\ndolor\nsit\namet");
   *
   * assertEquals(text.line_count, 5);
   * ```
   */
  get line_count(): number {
    return this.root.len === 0 ? 0 : this.root.eols_len + 1;
  }

  /**
   * Returns the characters in the text buffer starting at the specified index.
   *
   * @param `index` Start index.
   * @yields Characters.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = SliceTree.units("Lorem ipsum");
   *
   * assertEquals(text.read(0).toArray().join(""), "Lorem ipsum");
   * assertEquals(text.read([0, 0]).toArray().join(""), "Lorem ipsum");
   * ```
   */
  read(start: Index, end?: Index): IteratorObject<string> {
    const start_index = this.#index(start);

    if (typeof start_index === "number") {
      const first = find_node(this.root, start_index);

      if (first) {
        const chars = iter(first.node, first.offset);

        const end_index = end ? this.#index(end) : undefined;

        return typeof end_index === "number"
          ? chars.take(end_index - start_index)
          : chars;
      }
    }

    return [][Symbol.iterator]();
  }

  /**
   * Inserts a text into the buffer at the specified index.
   *
   * @param `index` Index at witch to insert the text.
   * @param `text` Text to insert.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = SliceTree.units();
   *
   * text.write(0, "Lorem ipsum");
   *
   * assertEquals(text.read(0).toArray().join(""), "Lorem ipsum");
   * ```
   */
  write(index: number, text: string): void {
    if (index < 0) {
      index = Math.max(index + this.count, 0);
    }

    let p = NIL;
    let insert_case = InsertionCase.Root;

    for (let x = this.root; x !== NIL;) {
      if (index <= x.left.len) {
        p = x;
        x = x.left;
        insert_case = InsertionCase.Left;
      } else {
        index -= x.left.len;

        if (index < x.slice.len) {
          p = x;
          x = NIL;
          insert_case = InsertionCase.Split;
        } else {
          index -= x.slice.len;

          p = x;
          x = x.right;
          insert_case = InsertionCase.Right;
        }
      }
    }

    if (insert_case === InsertionCase.Right && slice_growable(p.slice)) {
      grow_slice(p.slice, text);

      bubble_update(p);
    } else {
      const child = node_from_text(this.#reader, text);

      switch (insert_case) {
        case InsertionCase.Root: {
          this.root = child;
          this.root.red = false;
          break;
        }

        case InsertionCase.Left: {
          insert_left(this, p, child);
          break;
        }

        case InsertionCase.Right: {
          insert_right(this, p, child);
          break;
        }

        case InsertionCase.Split: {
          const y = split(this, p, index, 0);
          insert_left(this, y, child);
          break;
        }
      }
    }
  }

  /**
   * Inserts a text into the buffer at the specified line and column indexes.
   *
   * @param `line_index` Index of the line at witch to insert the text.
   * @param `column_index` Index of the column at witch to insert the text.
   * @param `text` Text to insert.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = SliceTree.units("Lorem\ndolor");
   *
   * text.write_line(1, 0, "ipsum\n");
   *
   * assertEquals(text.read(0).toArray().join(""), "Lorem\nipsum\ndolor");
   * ```
   */
  write_line(line_index: number, column_index: number, text: string): void {
    const range = this.find_line(line_index);
    if (!range) {
      return;
    }

    const index = range[0] + column_index;
    if (index > range[1]) {
      return;
    }

    this.write(index, text);
  }

  /**
   * Removes the text in the buffer starting at the specified index.
   *
   * @param `index` Index at witch to start removing the text.
   * @param `count` Number of characters to remove.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = SliceTree.units("Lorem ipsum");
   *
   * text.erase(5, 6);
   *
   * assertEquals(text.read(0).toArray().join(""), "Lorem");
   * ```
   */
  erase(index: number, count = Number.MAX_SAFE_INTEGER): void {
    if (index < 0) {
      index = Math.max(index + this.count, 0);
    }

    const first = find_node(this.root, index);
    if (!first) {
      return;
    }

    if (count <= 0) {
      return;
    }

    const { node, offset } = first;
    const offset2 = offset + count;

    if (offset2 === node.slice.len) {
      if (offset === 0) {
        delete_node(this, node);
      } else {
        trim_slice_end(node.slice, count);
        bubble_update(node);
      }
    } else if (offset2 < node.slice.len) {
      if (offset === 0) {
        trim_slice_start(node.slice, count);
        bubble_update(node);
      } else {
        split(this, node, offset, count);
      }
    } else {
      let x = node;
      let i = 0;

      if (offset !== 0) {
        x = split(this, node, offset, 0);
      }

      const last = find_node(this.root, index + count);
      if (last && last.offset !== 0) {
        split(this, last.node, last.offset, 0);
      }

      while ((x !== NIL) && (i < count)) {
        i += x.slice.len;

        const next = successor(x);

        delete_node(this, x);

        x = next;
      }
    }
  }

  /**
   * Removes the line of text in the buffer at the specified index.
   *
   * @param `line_index` Index of the line to remove.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = SliceTree.units("Lorem\nipsum\ndolor");
   *
   * text.erase_line(1);
   *
   * assertEquals(text.read(0).toArray().join(""), "Lorem\ndolor");
   * ```
   */
  erase_line(line_index: number): void {
    const range = this.find_line(line_index);

    if (range) {
      this.erase(range[0], range[1] - range[0]);
    }
  }

  /**
   * Removes the text in the buffer starting at the specified line and column indexes.
   *
   * @param `line_index` Index of the line at witch to start removing the text.
   * @param `column_index` Index of the column at witch to start removing the text.
   * @param `count` Number of characters to remove.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = SliceTree.units("Lorem\nipsum\ndolor");
   *
   * text.erase_from_line(1, 0);
   *
   * assertEquals(text.read(0).toArray().join(""), "Lorem\n");
   * ```
   */
  erase_from_line(
    line_index: number,
    column_index: number,
    count = Number.MAX_SAFE_INTEGER,
  ): void {
    const range = this.find_line(line_index);

    if (range) {
      this.erase(range[0] + column_index, count);
    }
  }

  /**
   * Returns the start index (inclusive) and the end index (exclusive) of the line of text in the buffer at the specified index.
   *
   * @param `line_index` Line index.
   * @returns Tuple of [start, end] indexes
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = SliceTree.units("Lorem\nipsum");
   *
   * assertEquals(text.find_line(0), [0, 6]);
   * ```
   */
  find_line(line_index: number): readonly [number, number] | undefined {
    if (line_index < 0) {
      line_index = Math.max(line_index + this.line_count, 0);
    }

    if (line_index === this.line_count) {
      return [this.count, this.count];
    }

    const start = line_index === 0 ? 0 : find_eol(this.root, line_index - 1);

    if (typeof start === "undefined") {
      return undefined;
    } else {
      const end = find_eol(this.root, line_index) ?? this.count;

      return [start, end];
    }
  }

  #index(index: Index): number | undefined {
    let i: number | undefined;

    if (typeof index === "number") {
      i = index;
    } else {
      let [ln, col] = index;
      if (ln < 0) {
        ln = Math.max(ln + this.line_count, 0);
      }
      i = ln === 0 ? 0 : find_eol(this.root, ln - 1);
      if (typeof i === "undefined") {
        return;
      }
      i += col;
    }

    if (typeof i === "undefined") {
      return;
    }
    if (i < 0) {
      i = Math.max(i + this.count, 0);
    }

    return i;
  }
}
