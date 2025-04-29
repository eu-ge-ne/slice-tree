import { bubble_metadata, NIL, Node, Tree } from "./node.ts";
import { tree_minimum } from "./querying.ts";
import { left_rotate, right_rotate } from "./rotation.ts";

export function rb_delete_node(tree: Tree, z: Node): void {
  let y = z;
  let y_original_color = y.red;
  let x: Node;

  if (z.left === NIL) {
    x = z.right;
    rb_transplant(tree, z, z.right);
    bubble_metadata(z.right.p);
  } else if (z.right === NIL) {
    x = z.left;
    rb_transplant(tree, z, z.left);
    bubble_metadata(z.left.p);
  } else {
    y = tree_minimum(z.right);
    y_original_color = y.red;
    x = y.right;

    if (y !== z.right) {
      rb_transplant(tree, y, y.right);
      y.right = z.right;
      y.right.p = y;
    } else {
      x.p = y;
    }

    rb_transplant(tree, z, y);
    y.left = z.left;
    y.left.p = y;
    y.red = z.red;
    bubble_metadata(y);
  }

  if (!y_original_color) {
    rb_delete_fixup(tree, x);
  }
}

function rb_transplant(tree: Tree, u: Node, v: Node): void {
  if (u.p === NIL) {
    tree.root = v;
  } else if (u === u.p.left) {
    u.p.left = v;
  } else {
    u.p.right = v;
  }

  v.p = u.p;
}

function rb_delete_fixup(tree: Tree, x: Node): void {
  while (x !== tree.root && !x.red) {
    if (x === x.p.left) {
      let w = x.p.right;
      if (w.red) {
        w.red = false;
        x.p.red = true;
        left_rotate(tree, x.p);
        w = x.p.right;
      }
      if (!w.left.red && !w.right.red) {
        w.red = true;
        x = x.p;
      } else {
        if (!w.right.red) {
          w.left.red = false;
          w.red = true;
          right_rotate(tree, w);
          w = x.p.right;
        }
        w.red = x.p.red;
        x.p.red = false;
        w.right.red = false;
        left_rotate(tree, x.p);
        x = tree.root;
      }
    } else {
      let w = x.p.left;
      if (w.red) {
        w.red = false;
        x.p.red = true;
        right_rotate(tree, x.p);
        w = x.p.left;
      }
      if (!w.right.red && !w.left.red) {
        w.red = true;
        x = x.p;
      } else {
        if (!w.left.red) {
          w.right.red = false;
          w.red = true;
          left_rotate(tree, w);
          w = x.p.left;
        }
        w.red = x.p.red;
        x.p.red = false;
        w.left.red = false;
        right_rotate(tree, x.p);
        x = tree.root;
      }
    }
  }
  x.red = false;
}
