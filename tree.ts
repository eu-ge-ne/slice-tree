import { type Buffer, create_buffer } from "./buffer.ts";
import { delete_node } from "./deletion.ts";
import { insert_left, insert_right } from "./insertion.ts";
import {
  bubble_metadata,
  create_node,
  NIL,
  type Node,
  node_text,
  root,
  split_node,
} from "./node.ts";
import { search, search_line_position, successor } from "./querying.ts";

/**
 * Implements a piece table data structure to represent text content.
 *
 * @example Usage
 *
 * ```ts
 * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
 *
 * const tree = new SliceTree();
 * ```
 */
export class SliceTree {
  /**
   * @ignore
   * @internal
   */
  [root] = NIL;

  #buffers: Buffer[] = [];

  /**
   * The total number of characters in the text content.
   *
   * @returns The number of characters
   *
   * @example Usage
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert/equals";
   *
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const tree = new SliceTree();
   * tree.write(0, "Lorem ipsum")
   *
   * assertEquals(tree.count, 11);
   * ```
   */
  get count(): number {
    return this[root].total_count;
  }

  /**
   * The number of lines in the text content.
   *
   * @returns The number of lines
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert/equals";
   *
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const tree = new SliceTree();
   * tree.write(0, "Lorem\nipsum\ndolor\nsit\namet")
   *
   * assertEquals(tree.line_count, 5);
   * ```
   */
  get line_count(): number {
    return this[root].total_count === 0 ? 0 : 1 + this[root].total_line_count;
  }

  /**
   * Returns the text from the content between the specified start and end positions, without modifying the original content.
   *
   * @param start Start index
   * @param end Optional end index
   * @returns An iterator over the text content
   */
  *read(start: number, end = Number.MAX_SAFE_INTEGER): Generator<string> {
    const first = search(this[root], start);
    if (!first) {
      return "";
    }

    let remaining = end - start;

    let n = Math.min(first.node.count - first.offset, remaining);
    remaining -= n;
    yield node_text(first.node, first.offset, first.offset + n);
    let node = successor(first.node);

    while ((node !== NIL) && (remaining > 0)) {
      n = Math.min(node.count, remaining);
      remaining -= n;
      yield node_text(node, 0, n);
      node = successor(node);
    }
  }

  /**
   * Returns the content of the line at the specified index, without modifying the original content.
   *
   * @param index Line index
   * @returns An iterator over the text content
   */
  *line(index: number): Generator<string> {
    const start = index === 0 ? 0 : search_line_position(this[root], index - 1);

    if (typeof start === "undefined") {
      yield "";
    } else {
      const end = search_line_position(this[root], index);

      yield* this.read(start, end);
    }
  }

  /**
   * Inserts the text into the content at the specified index.
   *
   * @param index Index at witch to insert the text
   * @param text Text to insert
   * @returns A void value
   */
  write(index: number, text: string): void {
    const buffer = create_buffer(text);
    this.#buffers.push(buffer);
    const child = create_node(buffer, 0, text.length);

    let node = this[root];
    let p: Node = NIL;
    let as_left_child = true;

    while (node !== NIL) {
      if (index <= node.left_count) {
        p = node;
        node = node.left;
        as_left_child = true;
        continue;
      }

      index -= node.left_count;
      if (index < node.count) {
        const x = split_node(this, node, index);
        insert_left(this, x, child);
        return;
      }

      index -= node.count;
      p = node;
      node = node.right;
      as_left_child = false;
    }

    if (p === NIL) {
      this[root] = child;
      this[root].red = false;
      bubble_metadata(this[root]);
    } else if (as_left_child) {
      insert_left(this, p, child);
    } else {
      insert_right(this, p, child);
    }
  }

  /**
   * Removes the text in the range between start and end from the content.
   *
   * @param index Index at witch to start removing the text
   * @param count The number of characters to remove
   * @returns A void value
   */
  erase(index: number, count: number): void {
    const first = search(this[root], index);
    if (!first) {
      return;
    }

    let x = first.node;
    let i = 0;

    if (first.offset !== 0) {
      x = split_node(this, first.node, first.offset);
    }

    const last = search(this[root], index + count);
    if (last && last.offset !== 0) {
      split_node(this, last.node, last.offset);
    }

    while ((x !== NIL) && (i < count)) {
      i += x.count;
      const next = successor(x);
      delete_node(this, x);
      x = next;
    }
  }
}
