import { NIL, type Node } from "./node.ts";

export function search(
  x: Node,
  i: number,
): { node: Node; offset: number } | undefined {
  while (x !== NIL) {
    if (i < x.left.total_chars) {
      x = x.left;
    } else {
      i -= x.left.total_chars;

      if (i < x.slice.length) {
        return { node: x, offset: i };
      } else {
        i -= x.slice.length;

        x = x.right;
      }
    }
  }
}

export function search_eol(x: Node, j: number): number | undefined {
  for (let i = 0; x !== NIL;) {
    if (j < x.left.total_eols) {
      x = x.left;
    } else {
      j -= x.left.total_eols;
      i += x.left.total_chars;

      if (j < x.slice.eols_length) {
        return i + x.slice.get_eol_end(x.slice.eols_start + j) - x.slice.start;
      } else {
        j -= x.slice.eols_length;
        i += x.slice.length;

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
