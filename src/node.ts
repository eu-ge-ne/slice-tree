import {
  type Buffer,
  create_buffer,
  grow_buffer,
  slice_buffer,
} from "./buffer.ts";
import { find_eol } from "./eol.ts";
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
  chars_start: number;
  chars_length: number;
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

export function create_node(text: string): Node {
  const buffer = create_buffer(text);

  return {
    red: true,
    p: NIL,
    left: NIL,
    right: NIL,

    buffer,
    chars_start: 0,
    chars_length: buffer.char_count,
    eols_start: 0,
    eols_length: buffer.eols.length,

    char_count: buffer.char_count,
    eol_count: buffer.eols.length,
  };
}

export function node_growable(x: Node): boolean {
  return x.chars_start + x.chars_length === x.buffer.char_count;
}

export function grow_node(x: Node, text: string): void {
  grow_buffer(x.buffer, text);

  resize(x, x.chars_length + [...text].length);
}

export function shrink_node(x: Node, count: number): void {
  resize(x, x.chars_length - count);
}

export function trim_node_start(x: Node, count: number): void {
  x.chars_start += count;
  x.chars_length -= count;

  x.eols_start = find_eol(x.buffer.eols, x.eols_start, x.chars_start);

  const eols_end = find_eol(
    x.buffer.eols,
    x.eols_start,
    x.chars_start + x.chars_length,
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
  const chars_start = x.chars_start + index + delete_count;
  const chars_length = x.chars_length - index - delete_count;

  resize(x, index);

  const eols_start = find_eol(
    x.buffer.eols,
    x.eols_start + x.eols_length,
    chars_start,
  );

  const eols_end = find_eol(
    x.buffer.eols,
    eols_start,
    chars_start + chars_length,
  );

  const eols_length = eols_end - eols_start;

  const node: Node = {
    red: true,
    p: NIL,
    left: NIL,
    right: NIL,

    buffer: x.buffer,
    chars_start,
    chars_length,
    eols_start,
    eols_length,

    char_count: chars_length,
    eol_count: eols_length,
  };

  insert_after(tree, x, node);

  return node;
}

export function bubble_update(x: Node): void {
  while (x !== NIL) {
    x.char_count = x.left.char_count + x.chars_length + x.right.char_count;
    x.eol_count = x.left.eol_count + x.eols_length + x.right.eol_count;
    x = x.p;
  }
}

export function slice_node(x: Node, start: number, end: number): string {
  return slice_buffer(x.buffer, x.chars_start + start, x.chars_start + end);
}

function resize(x: Node, length: number): void {
  x.chars_length = length;

  const eols_end = find_eol(
    x.buffer.eols,
    x.eols_start,
    x.chars_start + x.chars_length,
  );

  x.eols_length = eols_end - x.eols_start;

  bubble_update(x);
}
