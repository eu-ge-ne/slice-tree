import { NIL, Node } from "./node.ts";

export function tree_search(
  x: Node,
  i: number,
): { node: Node; offset: number } | undefined {
  while (x !== NIL) {
    if (i < x.left_count) {
      x = x.left;
      continue;
    } else {
      i -= x.left_count;
    }

    if (i < x.count) {
      return { node: x, offset: i };
    } else {
      i -= x.count;
    }

    x = x.right;
  }

  return;
}

export function tree_search_line_position(
  x: Node,
  l: number,
): number | undefined {
  let n = 0;

  while (x !== NIL) {
    if (l < x.left_line_count) {
      x = x.left;
      continue;
    } else {
      l -= x.left_line_count;
      n += x.left_count;
    }

    if (l < x.lines.length) {
      return n + x.lines[l]!;
    } else {
      l -= x.lines.length;
      n += x.count;
    }

    x = x.right;
  }

  return;
}

export function tree_minimum(x: Node): Node {
  while (x.left !== NIL) {
    x = x.left;
  }

  return x;
}

export function tree_maximum(x: Node): Node {
  while (x.right !== NIL) {
    x = x.right;
  }

  return x;
}

export function tree_predecessor(x: Node): Node {
  if (x.left !== NIL) {
    return tree_maximum(x.left);
  } else {
    let y = x.p;

    while (y !== NIL && x === y.left) {
      x = y;
      y = y.p;
    }

    return y;
  }
}

export function tree_successor(x: Node): Node {
  if (x.right !== NIL) {
    return tree_minimum(x.right);
  } else {
    let y = x.p;

    while (y !== NIL && x === y.right) {
      x = y;
      y = y.p;
    }

    return y;
  }
}
