import { type Buffer, line_starts } from "./buffer.ts";
import { insert_after } from "./insertion.ts";

export interface Tree {
  root: Node;
}

export interface Node {
  red: boolean;
  p: Node;
  left: Node;
  right: Node;

  readonly buffer: Buffer;
  readonly slice_start: number;
  slice_length: number;
  slice_lines: readonly number[];

  count: number;
  line_count: number;
}

const nil = {
  red: false,
  count: 0,
  line_count: 0,
} as Node;

export const NIL: Node = Object.create(nil);

nil.p = NIL;
nil.left = NIL;
nil.right = NIL;

export function create_node(
  buffer: Buffer,
  slice_start: number,
  slice_length: number,
): Node {
  return {
    red: true,
    p: NIL,
    left: NIL,
    right: NIL,

    buffer,
    slice_start,
    slice_length,
    slice_lines: line_starts(buffer, slice_start, slice_length),

    count: 0,
    line_count: 0,
  };
}

export function split_node(
  tree: Tree,
  x: Node,
  index: number,
  delete_count: number,
): Node {
  const new_start = x.slice_start + index + delete_count;
  const new_length = x.slice_length - index - delete_count;

  shrink_node(x, index);

  const node = create_node(x.buffer, new_start, new_length);

  insert_after(tree, x, node);

  return node;
}

export function node_growable(x: Node): boolean {
  return (x.buffer.text.length < 100) &&
    (x.slice_start + x.slice_length === x.buffer.text.length);
}

export function grow_node(x: Node, count: number): void {
  x.slice_length += count;
  x.slice_lines = line_starts(x.buffer, x.slice_start, x.slice_length);
}

export function shrink_node(x: Node, length: number): void {
  x.slice_length = length;
  // TODO: optimise
  x.slice_lines = line_starts(x.buffer, x.slice_start, length);
}

export function bubble_metadata(x: Node): void {
  while (x !== NIL) {
    x.count = x.left.count + x.slice_length + x.right.count;
    x.line_count = x.left.line_count + x.slice_lines.length +
      x.right.line_count;

    x = x.p;
  }
}
