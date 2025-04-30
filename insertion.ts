import { bubble_metadata, NIL, Node, root, Tree } from "./node.ts";
import { maximum, minimum } from "./querying.ts";
import { left_rotate, right_rotate } from "./rotation.ts";

export function insert_before(tree: Tree, parent: Node, child: Node): void {
  if (parent.left === NIL) {
    insert_left(tree, parent, child);
  } else {
    const x = maximum(parent.left);

    insert_right(tree, x, child);
  }
}

export function insert_after(tree: Tree, node: Node, child: Node): void {
  if (node.right === NIL) {
    insert_right(tree, node, child);
  } else {
    const x = minimum(node.right);

    insert_left(tree, x, child);
  }
}

export function insert_left(tree: Tree, parent: Node, child: Node): void {
  if (parent === NIL) {
    tree[root] = child;
    child.p = tree[root];
  } else {
    parent.left = child;
    child.p = parent;
  }

  bubble_metadata(child);
  insert_fixup(tree, child);
}

export function insert_right(tree: Tree, parent: Node, child: Node): void {
  if (parent === NIL) {
    tree[root] = child;
    child.p = tree[root];
  } else {
    parent.right = child;
    child.p = parent;
  }

  bubble_metadata(child);
  insert_fixup(tree, child);
}

function insert_fixup(tree: Tree, z: Node): void {
  while (z.p.red) {
    if (z.p === z.p.p.left) {
      const y = z.p.p.right;
      if (y.red) {
        z.p.red = false;
        y.red = false;
        z.p.p.red = true;
        z = z.p.p;
      } else {
        if (z === z.p.right) {
          z = z.p;
          left_rotate(tree, z);
        }
        z.p.red = false;
        z.p.p.red = true;
        right_rotate(tree, z.p.p);
      }
    } else {
      const y = z.p.p.left;
      if (y.red) {
        z.p.red = false;
        y.red = false;
        z.p.p.red = true;
        z = z.p.p;
      } else {
        if (z === z.p.left) {
          z = z.p;
          right_rotate(tree, z);
        }
        z.p.red = false;
        z.p.p.red = true;
        left_rotate(tree, z.p.p);
      }
    }
  }

  tree[root].red = false;
}
