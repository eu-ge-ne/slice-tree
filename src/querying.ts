import { NIL, type Node } from "./node.ts";

export function search(
  x: Node,
  i: number,
): { node: Node; offset: number } | undefined {
  while (x !== NIL) {
    if (i < x.left.char_count) {
      x = x.left;
    } else {
      i -= x.left.char_count;

      if (i < x.slice_length) {
        return { node: x, offset: i };
      } else {
        i -= x.slice_length;

        x = x.right;
      }
    }
  }
}

export function search_eol(x: Node, j: number): number | undefined {
  for (let i = 0; x !== NIL;) {
    if (j < x.left.eol_count) {
      x = x.left;
    } else {
      j -= x.left.eol_count;
      i += x.left.char_count;

      if (j < x.eols_length) {
        return i + x.buffer.eols[x.eols_start + j]!.end - x.slice_start;
      } else {
        j -= x.eols_length;
        i += x.slice_length;

        x = x.right;
      }
    }
  }
}

export function minimum(x: Node): Node {
  while (x.left !== NIL) {
    x = x.left;
  }

  return x;
}

export function successor(x: Node): Node {
  if (x.right !== NIL) {
    return minimum(x.right);
  } else {
    let y = x.p;

    while (y !== NIL && x === y.right) {
      x = y;
      y = y.p;
    }

    return y;
  }
}
