import { Slice } from "./slice.ts";

export interface Tree {
  root: Node;
}

export class Node {
  red = true;
  p = NIL;
  left = NIL;
  right = NIL;
  readonly slice: Slice;
  len: number;
  eols_len: number;

  constructor(slice: Slice) {
    this.slice = slice;
    this.len = slice.len;
    this.eols_len = slice.eols_len;
  }

  static from_text(text: string): Node {
    return new Node(Slice.from_text(text));
  }

  bubble_update(): void {
    let x = this as Node;

    while (x !== NIL) {
      x.len = x.left.len + x.slice.len + x.right.len;
      x.eols_len = x.left.eols_len + x.slice.eols_len + x.right.eols_len;
      x = x.p;
    }
  }
}

export const NIL = {
  red: false,
  len: 0,
  eols_len: 0,
  bubble_update: () => {},
} as Node;

NIL.p = NIL;
NIL.left = NIL;
NIL.right = NIL;
