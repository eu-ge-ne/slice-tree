import { insert_after } from "./insertion.ts";
import { bubble_update, create_node, type Node, type Tree } from "./node.ts";

export function split(
  tree: Tree,
  x: Node,
  index: number,
  delete_count: number,
): Node {
  const slice = x.slice.split(index, delete_count);

  bubble_update(x);

  const node = create_node(slice);

  insert_after(tree, x, node);

  return node;
}
