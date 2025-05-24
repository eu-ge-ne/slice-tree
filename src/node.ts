import type { Buffer } from "./buffer.ts";
import { find_eol_index } from "./eol.ts";
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
  slice_start: number;
  slice_length: number;
  slice_eols_start: number;
  slice_eols_length: number;

  char_count: number;
  eol_count: number;
}

const nil = {
  red: false,
  char_count: 0,
  eol_count: 0,
} as Node;

export const NIL: Node = Object.create(nil);

nil.p = NIL;
nil.left = NIL;
nil.right = NIL;

export function create_node(
  buffer: Buffer,
  slice_start: number,
  slice_length: number,
  slice_eols_start: number,
  slice_eols_length: number,
): Node {
  return {
    red: true,
    p: NIL,
    left: NIL,
    right: NIL,

    buffer,
    slice_start,
    slice_length,
    slice_eols_start,
    slice_eols_length,

    char_count: slice_length,
    eol_count: slice_eols_length,
  };
}

export function resize_node(x: Node, length: number): void {
  x.slice_length = length;

  const slice_eols_end = find_eol_index(
    x.buffer.eols,
    x.slice_eols_start,
    x.slice_start + x.slice_length,
  );

  x.slice_eols_length = slice_eols_end - x.slice_eols_start;

  bubble_update(x);
}

export function shrink_node_from_start(x: Node, count: number): void {
  x.slice_start += count;
  x.slice_length -= count;

  x.slice_eols_start = find_eol_index(
    x.buffer.eols,
    x.slice_eols_start,
    x.slice_start,
  );

  const slice_eols_end = find_eol_index(
    x.buffer.eols,
    x.slice_eols_start,
    x.slice_start + x.slice_length,
  );

  x.slice_eols_length = slice_eols_end - x.slice_eols_start;

  bubble_update(x);
}

export function split_node(
  tree: Tree,
  x: Node,
  index: number,
  delete_count: number,
): Node {
  const slice_start = x.slice_start + index + delete_count;
  const slice_length = x.slice_length - index - delete_count;

  resize_node(x, index);

  const slice_eols_start = find_eol_index(
    x.buffer.eols,
    x.slice_eols_start + x.slice_eols_length,
    slice_start,
  );

  const slice_eols_end = find_eol_index(
    x.buffer.eols,
    slice_eols_start,
    slice_start + slice_length,
  );

  const slice_eols_length = slice_eols_end - slice_eols_start;

  const node = create_node(
    x.buffer,
    slice_start,
    slice_length,
    slice_eols_start,
    slice_eols_length,
  );

  insert_after(tree, x, node);

  return node;
}

export function node_growable(x: Node): boolean {
  return (x.buffer.text.length < 100) &&
    (x.slice_start + x.slice_length === x.buffer.text.length);
}

export function bubble_update(x: Node): void {
  while (x !== NIL) {
    x.char_count = x.left.char_count + x.slice_length + x.right.char_count;
    x.eol_count = x.left.eol_count + x.slice_eols_length + x.right.eol_count;
    x = x.p;
  }
}
