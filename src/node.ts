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
  len: number;
  eols_len: number;
}

export const NIL = { red: false, len: 0, eols_len: 0 } as Node;

NIL.p = NIL;
NIL.left = NIL;
NIL.right = NIL;

export function create_node(slice: Slice): Node {
  return {
    red: true,
    p: NIL,
    left: NIL,
    right: NIL,
    slice,
    len: slice.len,
    eols_len: slice.eols_len,
  };
}

export function node_from_text(text: string): Node {
  return create_node(Slice.from_text(text));
}

export function bubble_update(x: Node): void {
  while (x !== NIL) {
    x.len = x.left.len + x.slice.len + x.right.len;
    x.eols_len = x.left.eols_len + x.slice.eols_len + x.right.eols_len;
    x = x.p;
  }
}
