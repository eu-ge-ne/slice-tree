import { Buffer } from "./buffer.ts";
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

  total_chars: number;
  total_eols: number;
}

const nil = {
  red: false,
  total_chars: 0,
  total_eols: 0,
} as Node;

export const NIL: Node = Object.create(nil);

nil.p = NIL;
nil.left = NIL;
nil.right = NIL;

export function create_node(text: string): Node {
  const buffer = new Buffer(text);

  return {
    red: true,
    p: NIL,
    left: NIL,
    right: NIL,

    buffer,
    chars_start: 0,
    chars_length: buffer.char_count,
    eols_start: 0,
    eols_length: buffer.eol_starts.length,

    total_chars: buffer.char_count,
    total_eols: buffer.eol_starts.length,
  };
}

export function node_growable(x: Node): boolean {
  return (x.buffer.char_count < 100) &&
    (x.chars_start + x.chars_length === x.buffer.char_count);
}

export function grow_node(x: Node, text: string): void {
  x.buffer.append(text);

  resize(x, x.chars_length + [...text].length);
}

export function shrink_node(x: Node, count: number): void {
  resize(x, x.chars_length - count);
}

export function trim_node_start(x: Node, count: number): void {
  x.chars_start += count;
  x.chars_length -= count;

  x.eols_start = x.buffer.find_eol(x.eols_start, x.chars_start);

  const eols_end = x.buffer.find_eol(
    x.eols_start,
    x.chars_start + x.chars_length,
  );

  x.eols_length = eols_end - x.eols_start;

  bubble_update(x);
}

export function split(
  tree: Tree,
  x: Node,
  index: number,
  delete_count: number,
): Node {
  const chars_start = x.chars_start + index + delete_count;
  const chars_length = x.chars_length - index - delete_count;

  resize(x, index);

  const eols_start = x.buffer.find_eol(
    x.eols_start + x.eols_length,
    chars_start,
  );

  const eols_end = x.buffer.find_eol(eols_start, chars_start + chars_length);

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

    total_chars: chars_length,
    total_eols: eols_length,
  };

  insert_after(tree, x, node);

  return node;
}

export function bubble_update(x: Node): void {
  while (x !== NIL) {
    x.total_chars = x.left.total_chars + x.chars_length + x.right.total_chars;
    x.total_eols = x.left.total_eols + x.eols_length + x.right.total_eols;
    x = x.p;
  }
}

export function read(
  x: Node,
  start: number,
  count: number,
): IteratorObject<string> {
  return x.buffer.read(x.chars_start + start, count);
}

function resize(x: Node, length: number): void {
  x.chars_length = length;

  const eols_end = x.buffer.find_eol(
    x.eols_start,
    x.chars_start + x.chars_length,
  );

  x.eols_length = eols_end - x.eols_start;

  bubble_update(x);
}
