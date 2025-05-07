import { assertEquals } from "jsr:@std/assert";

import { SliceTree } from "../src/tree.ts";
import { assert_tree } from "./assert.ts";

Deno.test("Empty tree contains 0 characters", () => {
  const text = new SliceTree();

  assertEquals(text.count, 0);

  assert_tree(text);
});
