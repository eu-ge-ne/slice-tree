import { insert_after } from "./insertion.ts";
import { type Slice, split_slice } from "./slice.ts";

export interface Tree {
  root: Node;
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

  slice: Slice;
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

export function create_node(slice: Slice): Node {
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

    slice,
  };
}

export function split_node(tree: Tree, x: Node, index: number): Node {
  const slice = split_slice(x.slice, index, 0);
  const node = create_node(slice);

  insert_after(tree, x, node);

  return node;
}

export function bubble_metadata(x: Node): void {
  while (x !== NIL) {
    x.left_count = x.left.total_count;
    x.left_line_count = x.left.total_line_count;

    x.right_count = x.right.total_count;
    x.right_line_count = x.right.total_line_count;

    x.total_count = x.left_count + x.slice.count + x.right_count;
    x.total_line_count = x.left_line_count + x.slice.lines.length +
      x.right_line_count;

    x = x.p;
  }
}
