import { NIL, type Node } from "./node.ts";

export function search(
  x: Node,
  i: number,
): { node: Node; offset: number } | undefined {
  while (x !== NIL) {
    if (i < x.left_count) {
      x = x.left;
    } else {
      i -= x.left_count;

      if (i < x.count) {
        return { node: x, offset: i };
      } else {
        i -= x.count;

        x = x.right;
      }
    }
  }
}

export function search_line_position(x: Node, l: number): number | undefined {
  for (let n = 0; x !== NIL;) {
    if (l < x.left_line_count) {
      x = x.left;
    } else {
      l -= x.left_line_count;
      n += x.left_count;

      if (l < x.lines.length) {
        return n + x.lines[l]!;
      } else {
        l -= x.lines.length;
        n += x.count;

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
