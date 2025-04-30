import { Buffer } from "./buffer.ts";
import { insert_after } from "./insertion.ts";

export const root = Symbol();

export interface Tree {
  [root]: Node;
}

export interface Node {
  red: boolean;
  p: Node;
  left: Node;
  right: Node;

  left_count: number;
  left_line_count: number;
  right_count: number;
  right_line_count: number;
  total_count: number;
  total_line_count: number;

  buffer: Buffer;
  start: number;
  count: number;
  lines: readonly number[];
}

const nil = {
  red: false,
  left_count: 0,
  left_line_count: 0,
  right_count: 0,
  right_line_count: 0,
  total_count: 0,
  total_line_count: 0,
} as Node;

export const NIL: Node = Object.create(nil);

nil.p = NIL;
nil.left = NIL;
nil.right = NIL;

export function create_node(
  buffer: Buffer,
  start: number,
  count: number,
): Node {
  const lines = line_starts(buffer, start, count);

  return {
    red: true,
    p: NIL,
    left: NIL,
    right: NIL,

    left_count: 0,
    left_line_count: 0,
    right_count: 0,
    right_line_count: 0,
    total_count: 0,
    total_line_count: 0,

    buffer,
    start,
    count,
    lines,
  };
}

export function split_node(tree: Tree, node: Node, i: number): Node {
  const { buffer, start, count } = node;

  node.count = i;
  node.lines = line_starts(node.buffer, node.start, node.count);
  bubble_metadata(node);

  const next = create_node(buffer, start + i, count - i);
  insert_after(tree, node, next);

  return next;
}

export function bubble_metadata(x: Node): void {
  while (x !== NIL) {
    x.left_count = x.left.total_count;
    x.left_line_count = x.left.total_line_count;

    x.right_count = x.right.total_count;
    x.right_line_count = x.right.total_line_count;

    x.total_count = x.left_count + x.count + x.right_count;
    x.total_line_count = x.left_line_count + x.lines.length +
      x.right_line_count;

    x = x.p;
  }
}

export function node_text(x: Node, start: number, end: number): string {
  return x.buffer.text.substring(
    x.start + start,
    x.start + end,
  );
}

function line_starts(buffer: Buffer, start: number, count: number): number[] {
  const end = start + count;

  const lines = buffer.line_breaks.filter((x) =>
    (x.start >= start) && (x.start < end)
  ).map((x) => x.end);

  return lines;
}
