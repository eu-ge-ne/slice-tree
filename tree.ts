import { Buffer, create_buffer } from "./buffer.ts";
import { rb_delete_node } from "./deletion.ts";
import { rb_insert_left, rb_insert_right } from "./insertion.ts";
import {
  bubble_metadata,
  create_node,
  NIL,
  Node,
  node_text,
  split_node,
  Tree,
} from "./node.ts";
import {
  tree_search,
  tree_search_line_position,
  tree_successor,
} from "./querying.ts";

export class SliceTree implements Tree {
  root = NIL;

  private buffers: Buffer[] = [];

  get count(): number {
    return this.root.total_count;
  }

  get line_count(): number {
    return 1 + this.root.total_line_count;
  }

  *read(start: number, end = Number.MAX_SAFE_INTEGER): Generator<string> {
    const first = tree_search(this.root, start);
    if (!first) {
      return "";
    }

    let remaining = end - start;

    let n = Math.min(first.node.count - first.offset, remaining);
    remaining -= n;
    yield node_text(first.node, first.offset, first.offset + n);
    let node = tree_successor(first.node);

    while ((node !== NIL) && (remaining > 0)) {
      n = Math.min(node.count, remaining);
      remaining -= n;
      yield node_text(node, 0, n);
      node = tree_successor(node);
    }
  }

  *line(index: number): Generator<string> {
    const start = index === 0
      ? 0
      : tree_search_line_position(this.root, index - 1);
    if (typeof start === "undefined") {
      yield "";
      return;
    }

    const end = tree_search_line_position(this.root, index);

    yield* this.read(start, end);
  }

  write(index: number, text: string): void {
    const buffer = create_buffer(text);
    this.buffers.push(buffer);
    const child = create_node(buffer, 0, text.length);

    let node = this.root;
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
        rb_insert_left(this, x, child);
        return;
      }

      index -= node.count;
      p = node;
      node = node.right;
      as_left_child = false;
    }

    if (p === NIL) {
      this.root = child;
      this.root.red = false;
      bubble_metadata(this.root);
    } else if (as_left_child) {
      rb_insert_left(this, p, child);
    } else {
      rb_insert_right(this, p, child);
    }
  }

  erase(index: number, count: number): void {
    const first = tree_search(this.root, index);
    if (!first) {
      return;
    }

    let x = first.node;
    let i = 0;

    if (first.offset !== 0) {
      x = split_node(this, first.node, first.offset);
    }

    const last = tree_search(this.root, index + count);
    if (last && last.offset !== 0) {
      split_node(this, last.node, last.offset);
    }

    while ((x !== NIL) && (i < count)) {
      i += x.count;
      const next = tree_successor(x);
      rb_delete_node(this, x);
      x = next;
    }
  }
}
