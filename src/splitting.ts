import { insert_after } from "./insertion.ts";
import { Node, type Tree } from "./node.ts";

export function split(tree: Tree, x: Node, index: number, gap: number): Node {
  const slice = x.slice.split(index, gap);

  x.bubble_update();

  const node = new Node(slice);

  insert_after(tree, x, node);

  return node;
}
