import { type BufferFactory, GraphemeBufferFactory } from "./buffer.ts";
import { delete_node } from "./deletion.ts";
import { insert_left, insert_right, InsertionCase } from "./insertion.ts";
import { bubble_update, iter, NIL, node_from_text } from "./node.ts";
import { PointBufferFactory } from "./point.ts";
import { find_eol, find_node, successor } from "./querying.ts";
import {
  grow_slice,
  slice_growable,
  trim_slice_end,
  trim_slice_start,
} from "./slice.ts";
import { split } from "./splitting.ts";
import { UnitBufferFactory } from "../src/unit.ts";

/**
 * Represents position in text buffer. Can be either `number` or `[number, number]`:
 * - `number` is an offset from the start of buffer
 * - `[number, number]` are [line, column] indexes
 */
export type Position = number | readonly [number, number];

/**
 * Implements `piece table` data structure to represent text buffer.
 */
export class SliceTree {
  #factory: BufferFactory;

  /**
   * @ignore
   * @internal
   */
  root = NIL;

  private constructor(factory: BufferFactory, text?: string) {
    this.#factory = factory;

    if (text && text.length > 0) {
      this.root = node_from_text(factory, text);
      this.root.red = false;
    }
  }

  /**
   * Creates instance of `SliceTree` interpreting text characters as `UTF-16 code units`. Visit [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#utf-16_characters_unicode_code_points_and_grapheme_clusters) for more details. Accepts optional initial text.
   *
   * @param `text` Initial text.
   * @returns `SliceTree` instance.
   */
  static units(text?: string): SliceTree {
    return new SliceTree(new UnitBufferFactory(), text);
  }

  /**
   * Creates instance of `SliceTree` interpreting text characters as `Unicode code points`. Visit [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#utf-16_characters_unicode_code_points_and_grapheme_clusters) for more details. Accepts optional initial text.
   *
   * @param `text` Initial text.
   * @returns `SliceTree` instance.
   */
  static points(text?: string): SliceTree {
    return new SliceTree(new PointBufferFactory(), text);
  }

  /**
   * Creates instance of `SliceTree` interpreting text characters as `Unicode graphemes`. Visit [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#utf-16_characters_unicode_code_points_and_grapheme_clusters) for more details. Accepts optional initial text.
   *
   * @param `text` Initial text.
   * @returns `SliceTree` instance.
   */
  static graphemes(text?: string): SliceTree {
    return new SliceTree(new GraphemeBufferFactory(), text);
  }

  /**
   * Returns number of characters in the buffer.
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
   * Returns number of lines in the buffer.
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
   * Returns characters in the buffer's section, specified by start (inclusive) and end (exclusive) positions.
   *
   * @param `start` Start position.
   * @param `end` Optional end position.
   * @yields Characters.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = SliceTree.points("Lorem\nipsum");
   *
   * assertEquals(text.read(0)?.toArray().join(""), "Lorem\nipsum");
   * assertEquals(text.read(6)?.toArray().join(""), "ipsum");
   * assertEquals(text.read([0, 0], [1, 0])?.toArray().join(""), "Lorem\n");
   * assertEquals(text.read([1, 0], [2, 0])?.toArray().join(""), "ipsum");
   * ```
   */
  read(start: Position, end?: Position): IteratorObject<string> | undefined {
    const start_index = this.to_index(start);

    if (typeof start_index === "number") {
      const first = find_node(this.root, start_index);

      if (first) {
        const chars = iter(first.node, first.offset);

        const end_index = end ? this.to_index(end) : undefined;

        return typeof end_index === "number"
          ? chars.take(end_index - start_index)
          : chars;
      }
    }
  }

  /**
   * Inserts text into the buffer at the specified position.
   *
   * @param `position` Position at witch to insert the text.
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
   * text.write(0, "Lorem");
   * text.write([0, 5], " ipsum");
   *
   * assertEquals(text.read(0)?.toArray().join(""), "Lorem ipsum");
   * ```
   */
  write(position: Position, text: string): void {
    let index = this.to_index(position);

    if (typeof index === "number") {
      let p = NIL;
      let insert_case = InsertionCase.Root;

      for (let x = this.root; x !== NIL;) {
        if (index <= x.left.len) {
          insert_case = InsertionCase.Left;
          p = x;
          x = x.left;
        } else {
          index -= x.left.len;

          if (index < x.slice.len) {
            insert_case = InsertionCase.Split;
            p = x;
            x = NIL;
          } else {
            index -= x.slice.len;

            insert_case = InsertionCase.Right;
            p = x;
            x = x.right;
          }
        }
      }

      if (insert_case === InsertionCase.Right && slice_growable(p.slice)) {
        grow_slice(p.slice, text);

        bubble_update(p);
      } else {
        const child = node_from_text(this.#factory, text);

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
  }

  /**
   * Removes characters in the buffer's section, specified by start (inclusive) and end (exclusive) positions.
   *
   * @param `start` Start position.
   * @param `end` Optional end position.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = SliceTree.units("Lorem ipsum");
   *
   * text.erase(5, 11);
   *
   * assertEquals(text.read(0)?.toArray().join(""), "Lorem");
   * ```
   */
  erase(start: Position, end?: Position): void {
    const start_index = this.to_index(start);

    if (typeof start_index === "number") {
      const first = find_node(this.root, start_index);

      if (first) {
        const end_index = (end ? this.to_index(end) : undefined) ??
          Number.MAX_SAFE_INTEGER;
        const count = end_index - start_index;

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

          const last = find_node(this.root, end_index);
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
    }
  }

  /**
   * Returns index of the character in the buffer at the specified position.
   *
   * @param `position` Position.
   * @returns Index
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = SliceTree.units("Lorem\nipsum");
   *
   * assertEquals(text.to_index([1, 0]), 6);
   * ```
   */
  to_index(position: Position): number | undefined {
    let index: number | undefined;

    if (typeof position === "number") {
      index = position;
    } else {
      let line = position[0];
      if (line < 0) {
        line = Math.max(this.line_count + line, 0);
      }

      index = line === 0 ? 0 : find_eol(this.root, line - 1);
      if (typeof index === "number") {
        index += position[1];
      }
    }

    if (typeof index === "number") {
      if (index < 0) {
        index = Math.max(this.count + index, 0);
      }

      if (index <= this.count) {
        return index;
      }
    }
  }
}
