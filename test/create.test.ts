import { assertEquals } from "@std/assert";

import { SliceTree } from "../src/mod.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

Deno.test("Create empty", () => {
  const text = new SliceTree();

  assert_iterator(text.read(0), undefined);
  assertEquals(text.count, 0);
  assertEquals(text.line_count, 0);

  assert_tree(text);
});

Deno.test("Create", () => {
  const text = new SliceTree("A");

  assert_iterator(text.read(0), "A");
  assertEquals(text.count, 1);
  assertEquals(text.line_count, 1);

  assert_tree(text);
});
