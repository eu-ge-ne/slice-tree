import { type Buffer, create_buffer, grow_buffer } from "./buffer.ts";
import { delete_node } from "./deletion.ts";
import { insert_left, insert_right, InsertionCase } from "./insertion.ts";
import {
  bubble_update,
  create_node,
  NIL,
  node_growable,
  resize_node,
  split_node,
} from "./node.ts";
import { search, search_eol, successor } from "./querying.ts";

/**
 * Implements a `piece table` data structure to represent text content.
 *
 * @example Usage
 *
 * ```ts
 * import { assertInstanceOf } from "@std/assert";
 * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
 *
 * assertInstanceOf(new SliceTree(), SliceTree);
 * ```
 */
export class SliceTree {
  /**
   * @ignore
   * @internal
   */
  root = NIL;

  /**
   * @ignore
   * @internal
   */
  buffers: Buffer[] = [];

  /**
   * Creates a `SliceTree` instance with optional initial text.
   *
   * @param text Optional initial text.
   *
   * @example Usage
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = new SliceTree("Lorem ipsum");
   *
   * assertEquals(text.count, 11);
   * ```
   */
  constructor(text?: string) {
    if (text && text.length > 0) {
      const buffer = create_buffer(this, text);

      this.root = create_node(buffer, 0, text.length);
      this.root.red = false;

      bubble_update(this.root);
    }
  }

  /**
   * Returns the total number of characters in the text content.
   *
   * @returns The number of characters.
   *
   * @example Usage
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = new SliceTree("Lorem ipsum");
   *
   * assertEquals(text.count, 11);
   * ```
   */
  get count(): number {
    return this.root.length;
  }

  /**
   * Returns the number of lines in the text content.
   *
   * @returns The number of lines.
   *
   * @example Usage
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");
   *
   * assertEquals(text.line_count, 5);
   * ```
   */
  get line_count(): number {
    return this.root.length === 0 ? 0 : this.root.eols_length + 1;
  }

  /**
   * Returns the text between the specified start (inclusive) and end (exclusive) positions.
   *
   * @param start Start index.
   * @param end Optional end index.
   * @returns An iterator over the text content.
   *
   * @example Usage
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = new SliceTree("Lorem ipsum");
   *
   * assertEquals(text.read(0).toArray().join(""), "Lorem ipsum");
   * ```
   */
  *read(start: number, end = Number.MAX_SAFE_INTEGER): Generator<string> {
    if (start < 0) {
      start = Math.max(start + this.count, 0);
    }

    const first = search(this.root, start);
    if (!first) {
      return "";
    }

    if (end < 0) {
      end = Math.max(end + this.count, 0);
    }

    if (end <= start) {
      return "";
    }

    let remaining = end - start;
    let x = first.node;
    let offset = first.offset;

    while ((x !== NIL) && (remaining > 0)) {
      let n = x.slice_length - offset;

      if (n > remaining) {
        n = remaining;
        remaining = 0;
      } else {
        remaining -= n;
      }

      yield x.buffer.text.slice(
        x.slice_start + offset,
        x.slice_start + offset + n,
      );

      x = successor(x);
      offset = 0;
    }
  }

  /**
   * Returns the start index (inclusive) and the end index (exclusive) of the line at the specified index.
   *
   * @param index Line index.
   * @returns A tuple of [start, end] indexes
   *
   * @example Usage
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = new SliceTree("Lorem\nipsum");
   *
   * assertEquals(text.line_range(0), [0, 6]);
   * ```
   */
  line_range(index: number): readonly [number, number | undefined] | undefined {
    if (index < 0) {
      index = Math.max(index + this.line_count, 0);
    }

    const start = index === 0 ? 0 : search_eol(this.root, index - 1);

    if (typeof start === "undefined") {
      return undefined;
    } else {
      const end = search_eol(this.root, index);

      return [start, end];
    }
  }

  /**
   * Returns the content of the line at the specified index.
   *
   * @param index Line index.
   * @returns An iterator over the text content.
   *
   * @example Usage
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");
   *
   * assertEquals(text.line(1).toArray().join(""), "ipsum\n");
   * ```
   */
  *line(index: number): Generator<string> {
    if (index < 0) {
      index = Math.max(index + this.line_count, 0);
    }

    const start = index === 0 ? 0 : search_eol(this.root, index - 1);

    if (typeof start === "undefined") {
      yield "";
    } else {
      const end = search_eol(this.root, index);

      yield* this.read(start, end);
    }
  }

  /**
   * Inserts the given text at the specified index in the content.
   *
   * @param index Index at witch to insert the text.
   * @param text Text to insert.
   * @returns A void value.
   *
   * @example Usage
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = new SliceTree();
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
      if (index <= x.left.length) {
        p = x;
        x = x.left;
        insert_case = InsertionCase.Left;
      } else {
        index -= x.left.length;

        if (index < x.slice_length) {
          p = x;
          x = NIL;
          insert_case = InsertionCase.Split;
        } else {
          index -= x.slice_length;

          p = x;
          x = x.right;
          insert_case = InsertionCase.Right;
        }
      }
    }

    if (insert_case === InsertionCase.Right && node_growable(p)) {
      grow_buffer(p.buffer, text);
      resize_node(p, p.slice_length + text.length);

      bubble_update(p);
    } else {
      const buffer = create_buffer(this, text);
      const child = create_node(buffer, 0, text.length);

      switch (insert_case) {
        case InsertionCase.Root: {
          this.root = child;
          this.root.red = false;

          bubble_update(this.root);
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
          const y = split_node(this, p, index, 0);

          insert_left(this, y, child);
          break;
        }
      }
    }
  }

  /**
   * Removes the text in the range from index (inclusive) to index + count (exclusive).
   *
   * @param index Index at witch to start removing the text.
   * @param count The number of characters to remove.
   * @returns A void value.
   *
   * @example Usage
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = new SliceTree("Lorem ipsum");
   *
   * text.erase(5, 6);;
   *
   * assertEquals(text.read(0).toArray().join(""), "Lorem");
   * ```
   */
  erase(index: number, count: number): void {
    if (index < 0) {
      index = Math.max(index + this.count, 0);
    }

    const first = search(this.root, index);
    if (!first) {
      return;
    }

    if (first.offset + count === first.node.slice_length) {
      resize_node(first.node, first.node.slice_length - count);

      bubble_update(first.node);
    } else if (first.offset + count <= first.node.slice_length) {
      split_node(this, first.node, first.offset, count);
    } else {
      let x = first.node;
      let i = 0;

      if (first.offset !== 0) {
        x = split_node(this, first.node, first.offset, 0);
      }

      const last = search(this.root, index + count);
      if (last && last.offset !== 0) {
        split_node(this, last.node, last.offset, 0);
      }

      while ((x !== NIL) && (i < count)) {
        i += x.slice_length;
        const next = successor(x);
        delete_node(this, x);
        x = next;
      }
    }
  }
}
