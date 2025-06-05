import { delete_node } from "./deletion.ts";
import { insert_left, insert_right, InsertionCase } from "./insertion.ts";
import { bubble_update, NIL, node_from_text } from "./node.ts";
import { search, search_eol, successor } from "./querying.ts";
import { split } from "./splitting.ts";

/**
 * Implements `piece table` data structure to represent text buffer.
 */
export class SliceTree {
  /**
   * @ignore
   * @internal
   */
  root = NIL;

  /**
   * Creates an instance of `SliceTree` with some optional initial text.
   *
   * @param `text` Initial text.
   * @returns `SliceTree` instance.
   */
  constructor(text?: string) {
    if (text && text.length > 0) {
      this.root = node_from_text(text);

      this.root.red = false;
    }
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
   * const text = new SliceTree("Lorem ipsum");
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
   * const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");
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
   * const text = new SliceTree("Lorem ipsum");
   *
   * assertEquals(text.read(0).toArray().join(""), "Lorem ipsum");
   * ```
   */
  *read(index: number): Generator<string> {
    if (index < 0) {
      index = Math.max(index + this.count, 0);
    }

    const first = search(this.root, index);
    if (!first) {
      return "";
    }

    let x = first.node;
    let offset = first.offset;

    while (x !== NIL) {
      yield* x.slice.read(offset, x.slice.len - offset);

      x = successor(x);

      offset = 0;
    }
  }

  /**
   * Returns the characters in the line of text buffer.
   *
   * @param `line_index` Line index.
   * @yields Characters.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");
   *
   * assertEquals(text.read_line(1).toArray().join(""), "ipsum\n");
   * ```
   */
  *read_line(line_index: number): Generator<string> {
    if (line_index < 0) {
      line_index = Math.max(line_index + this.line_count, 0);
    }

    const start = line_index === 0 ? 0 : search_eol(this.root, line_index - 1);

    if (typeof start === "undefined") {
      yield "";
    } else {
      const iter = this.read(start);

      const end = search_eol(this.root, line_index);

      if (typeof end === "undefined") {
        yield* iter;
      } else {
        yield* iter.take(end - start);
      }
    }
  }

  /**
   * Returns the characters in the text buffer starting at the specified line index.
   *
   * @param `line_index` Line index.
   * @yields Characters.
   *
   * @example
   *
   * ```ts
   * import { assertEquals } from "jsr:@std/assert";
   * import { SliceTree } from "jsr:@eu-ge-ne/slice-tree";
   *
   * const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");
   *
   * assertEquals(text.read_from_line(1).toArray().join(""), "ipsum\ndolor\nsit\namet");
   * ```
   */
  *read_from_line(line_index: number): Generator<string> {
    if (line_index < 0) {
      line_index = Math.max(line_index + this.line_count, 0);
    }

    const start = line_index === 0 ? 0 : search_eol(this.root, line_index - 1);

    if (typeof start === "undefined") {
      yield "";
    } else {
      yield* this.read(start);
    }
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

    if (insert_case === InsertionCase.Right && p.slice.growable) {
      p.slice.append(text);

      bubble_update(p);
    } else {
      const child = node_from_text(text);

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
   * const text = new SliceTree("Lorem\ndolor");
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
   * const text = new SliceTree("Lorem ipsum");
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

    const first = search(this.root, index);
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
        node.slice.trim_end(count);
        bubble_update(node);
      }
    } else if (offset2 < node.slice.len) {
      if (offset === 0) {
        node.slice.trim_start(count);
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

      const last = search(this.root, index + count);
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
   * const text = new SliceTree("Lorem\nipsum\ndolor");
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
   * const text = new SliceTree("Lorem\nipsum");
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

    const start = line_index === 0 ? 0 : search_eol(this.root, line_index - 1);

    if (typeof start === "undefined") {
      return undefined;
    } else {
      const end = search_eol(this.root, line_index) ?? this.count;

      return [start, end];
    }
  }
}
