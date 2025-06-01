import { Slice } from "./slice.ts";

export interface Tree {
  root: Node;
}

export interface Node {
  red: boolean;
  p: Node;
  left: Node;
  right: Node;
  slice: Slice;
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

export function create_node(slice: Slice): Node {
  return {
    red: true,
    p: NIL,
    left: NIL,
    right: NIL,
    slice,
    total_chars: slice.length,
    total_eols: slice.eols_length,
  };
}

export function node_from_text(text: string): Node {
  return create_node(Slice.from_text(text));
}

export function bubble_update(x: Node): void {
  while (x !== NIL) {
    x.total_chars = x.left.total_chars + x.slice.length + x.right.total_chars;
    x.total_eols = x.left.total_eols + x.slice.eols_length + x.right.total_eols;
    x = x.p;
  }
}
