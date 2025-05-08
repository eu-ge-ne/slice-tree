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
  slice: Slice;
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

export function create_node(slice: Slice): Node {
  return {
    red: true,
    p: NIL,
    left: NIL,
    right: NIL,
    slice,
    count: 0,
    line_count: 0,
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
    x.count = x.left.count + x.slice.count + x.right.count;
    x.line_count = x.left.line_count + x.slice.lines.length +
      x.right.line_count;

    x = x.p;
  }
}
