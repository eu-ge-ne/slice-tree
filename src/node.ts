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
  text_start: number;
  text_length: number;
  eols_start: number;
  eols_length: number;

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
  text_start: number,
  text_length: number,
  eols_start: number,
  eols_length: number,
): Node {
  return {
    red: true,
    p: NIL,
    left: NIL,
    right: NIL,

    buffer,
    text_start,
    text_length,
    eols_start,
    eols_length,

    char_count: text_length,
    eol_count: eols_length,
  };
}

export function resize_node(x: Node, length: number): void {
  x.text_length = length;

  const eols_end = find_eol_index(
    x.buffer.eols,
    x.eols_start,
    x.text_start + x.text_length,
  );

  x.eols_length = eols_end - x.eols_start;

  bubble_update(x);
}

export function shrink_node_from_start_todo(x: Node, count: number): void {
  x.text_start += count;
  x.text_length -= count;

  x.eols_start = find_eol_index(x.buffer.eols, x.eols_start, x.text_start);

  const eols_end = find_eol_index(
    x.buffer.eols,
    x.eols_start,
    x.text_start + x.text_length,
  );

  x.eols_length = eols_end - x.eols_start;

  bubble_update(x);
}

export function split_node(
  tree: Tree,
  x: Node,
  index: number,
  delete_count: number,
): Node {
  const text_start = x.text_start + index + delete_count;
  const text_length = x.text_length - index - delete_count;

  resize_node(x, index);

  const eols_start = find_eol_index(
    x.buffer.eols,
    x.eols_start + x.eols_length,
    text_start,
  );

  const eols_end = find_eol_index(
    x.buffer.eols,
    eols_start,
    text_start + text_length,
  );

  const eols_length = eols_end - eols_start;

  const node = create_node(
    x.buffer,
    text_start,
    text_length,
    eols_start,
    eols_length,
  );

  insert_after(tree, x, node);

  return node;
}

export function node_growable(x: Node): boolean {
  return (x.buffer.text.length < 100) &&
    (x.text_start + x.text_length === x.buffer.text.length);
}

export function bubble_update(x: Node): void {
  while (x !== NIL) {
    x.char_count = x.left.char_count + x.text_length + x.right.char_count;
    x.eol_count = x.left.eol_count + x.eols_length + x.right.eol_count;
    x = x.p;
  }
}
