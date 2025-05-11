import type { Buffer } from "./buffer.ts";
import { eols_index_gte, eols_index_lte } from "./eol.ts";
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
  readonly slice_eols_start: number;
  slice_eols_length: number;

  length: number;
  eols_length: number;
}

const nil = {
  red: false,
  length: 0,
  eols_length: 0,
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

    length: 0,
    eols_length: 0,
  };
}

export function resize_node(x: Node, length: number): void {
  x.slice_length = length;

  x.slice_eols_length = eols_index_lte(
    x.buffer.eols,
    x.slice_start + length,
    x.slice_eols_start,
  ) - x.slice_eols_start;
}

export function split_node(
  tree: Tree,
  x: Node,
  index: number,
  delete_count: number,
): Node {
  const slice_start = x.slice_start + index + delete_count;
  const slice_length = x.slice_length - index - delete_count;

  const slice_eols_start = eols_index_gte(x.buffer.eols, slice_start);
  const slice_eols_length = eols_index_lte(
    x.buffer.eols,
    slice_start + slice_length,
    slice_eols_start,
  ) - slice_eols_start;

  const node = create_node(
    x.buffer,
    slice_start,
    slice_length,
    slice_eols_start,
    slice_eols_length,
  );

  resize_node(x, index);
  insert_after(tree, x, node);

  return node;
}

export function node_growable(x: Node): boolean {
  return (x.buffer.text.length < 100) &&
    (x.slice_start + x.slice_length === x.buffer.text.length);
}

export function bubble_update(x: Node): void {
  while (x !== NIL) {
    x.length = x.left.length + x.slice_length + x.right.length;
    x.eols_length = x.left.eols_length + x.slice_eols_length +
      x.right.eols_length;

    x = x.p;
  }
}
