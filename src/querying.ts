import { NIL, type Node } from "./node.ts";

export function find(
  x: Node,
  i?: number,
): { node: Node; offset: number } | undefined {
  if (typeof i === "number") {
    while (x !== NIL) {
      if (i < x.left.len) {
        x = x.left;
      } else {
        i -= x.left.len;

        if (i < x.slice.len) {
          return { node: x, offset: i };
        } else {
          i -= x.slice.len;

          x = x.right;
        }
      }
    }
  }
}

export function search_eol(x: Node, j: number): number | undefined {
  for (let i = 0; x !== NIL;) {
    if (j < x.left.eols_len) {
      x = x.left;
    } else {
      j -= x.left.eols_len;
      i += x.left.len;

      if (j < x.slice.eols_len) {
        return i + x.slice.buf.eol_ends[x.slice.eols_start + j]! -
          x.slice.start;
      } else {
        j -= x.slice.eols_len;
        i += x.slice.len;

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
