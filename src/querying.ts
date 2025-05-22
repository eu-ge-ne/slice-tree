import { NIL, type Node } from "./node.ts";

export function search(
  x: Node,
  i: number,
): { node: Node; offset: number } | undefined {
  while (x !== NIL) {
    if (i < x.left.length) {
      x = x.left;
    } else {
      i -= x.left.length;

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
  for (let i = 0; x !== NIL; ) {
    if (j < x.left.eols_length) {
      x = x.left;
    } else {
      j -= x.left.eols_length;
      i += x.left.length;

      if (j < x.slice_eols_length) {
        return i + x.buffer.eols[x.slice_eols_start + j]!.end - x.slice_start;
      } else {
        j -= x.slice_eols_length;
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
