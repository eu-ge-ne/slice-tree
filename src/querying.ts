import { NIL, type Node } from "./node.ts";

export function search(
  x: Node,
  i: number,
): { node: Node; offset: number } | undefined {
  while (x !== NIL) {
    if (i < x.left.count) {
      x = x.left;
    } else {
      i -= x.left.count;

      if (i < x.slice_length) {
        return { node: x, offset: i };
      } else {
        i -= x.slice_length;

        x = x.right;
      }
    }
  }
}

export function search_line_position(x: Node, l: number): number | undefined {
  for (let i = 0; x !== NIL;) {
    if (l < x.left.line_count) {
      x = x.left;
    } else {
      l -= x.left.line_count;
      i += x.left.count;

      if (l < x.slice_lines.length) {
        return i + x.slice_lines[l]!;
      } else {
        l -= x.slice_lines.length;
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
