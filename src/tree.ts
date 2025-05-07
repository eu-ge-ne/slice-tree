import { add_to_buffer, type Buffer, create_buffer } from "./buffer.ts";
import { delete_node } from "./deletion.ts";
import {
  insert_after,
  insert_left,
  insert_right,
  InsertionCase,
} from "./insertion.ts";
import { bubble_metadata, create_node, NIL, split_node } from "./node.ts";
import { search, search_line_position, successor } from "./querying.ts";
import {
  create_slice,
  resize_slice,
  slice_growable,
  split_slice,
} from "./slice.ts";

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
   * Returns the total number of characters in the text content.
   *
   * @returns The number of characters
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
   * assertEquals(text.count, 11);
   * ```
   */
  get count(): number {
    return this.root.total_count;
  }

  /**
   * Returns the number of lines in the text content.
   *
   * @returns The number of lines
   *
   * @example Usage
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = new SliceTree();
   *
   * text.write(0, "Lorem\nipsum\ndolor\nsit\namet");
   *
   * assertEquals(text.line_count, 5);
   * ```
   */
  get line_count(): number {
    return this.root.total_count === 0 ? 0 : 1 + this.root.total_line_count;
  }

  /**
   * Returns the text between the specified start (inclusive) and end (exclusive) positions, without modifying the content.
   *
   * @param start Start index
   * @param end Optional end index
   * @returns An iterator over the text content
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
      let n = x.slice.count - offset;

      if (n > remaining) {
        n = remaining;
        remaining = 0;
      } else {
        remaining -= n;
      }

      yield x.slice.buffer.text.slice(
        x.slice.start + offset,
        x.slice.start + offset + n,
      );

      x = successor(x);
      offset = 0;
    }
  }

  /**
   * Returns the content of the line at the specified index, without modifying the content.
   *
   * @param index Line index
   * @returns An iterator over the text content
   *
   * @example Usage
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = new SliceTree();
   *
   * text.write(0, "Lorem\nipsum\ndolor\nsit\namet");
   *
   * assertEquals(text.line(1).toArray().join(""), "ipsum\n");
   * ```
   */
  *line(index: number): Generator<string> {
    if (index < 0) {
      index = Math.max(index + this.line_count, 0);
    }

    const start = index === 0 ? 0 : search_line_position(this.root, index - 1);

    if (typeof start === "undefined") {
      yield "";
    } else {
      const end = search_line_position(this.root, index);

      yield* this.read(start, end);
    }
  }

  /**
   * Inserts the given text at the specified index in the content.
   *
   * @param index Index at witch to insert the text
   * @param text Text to insert
   * @returns A void value
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
      if (index <= x.left_count) {
        p = x;
        x = x.left;
        insert_case = InsertionCase.Left;
      } else {
        index -= x.left_count;

        if (index < x.slice.count) {
          p = x;
          x = NIL;
          insert_case = InsertionCase.Split;
        } else {
          index -= x.slice.count;

          p = x;
          x = x.right;
          insert_case = InsertionCase.Right;
        }
      }
    }

    if (insert_case === InsertionCase.Right && slice_growable(p.slice)) {
      add_to_buffer(p.slice.buffer, text);
      resize_slice(p.slice, text.length);

      bubble_metadata(p);
    } else {
      const buffer = create_buffer(this, text);
      const slice = create_slice(buffer, 0, text.length);
      const child = create_node(slice);

      switch (insert_case) {
        case InsertionCase.Root: {
          this.root = child;
          this.root.red = false;

          bubble_metadata(this.root);
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
          const y = split_node(this, p, index);

          insert_left(this, y, child);
          break;
        }
      }
    }
  }

  /**
   * Removes the text in the range from index (inclusive) to index + count (exclusive).
   *
   * @param index Index at witch to start removing the text
   * @param count The number of characters to remove
   * @returns A void value
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

    if (first.offset + count === first.node.slice.count) {
      resize_slice(first.node.slice, -count);

      bubble_metadata(first.node);
    } else if (first.offset + count <= first.node.slice.count) {
      const slice = split_slice(first.node.slice, first.offset, count);
      const node = create_node(slice);

      insert_after(this, first.node, node);
    } else {
      let x = first.node;
      let i = 0;

      if (first.offset !== 0) {
        x = split_node(this, first.node, first.offset);
      }

      const last = search(this.root, index + count);
      if (last && last.offset !== 0) {
        split_node(this, last.node, last.offset);
      }

      while ((x !== NIL) && (i < count)) {
        i += x.slice.count;
        const next = successor(x);
        delete_node(this, x);
        x = next;
      }
    }
  }
}
