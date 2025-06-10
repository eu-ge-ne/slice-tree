import { assertEquals } from "@std/assert";

import { SliceTree } from "../src/mod.ts";
import { assert_tree } from "./assert.ts";

Deno.test("Create empty", () => {
  const text = new SliceTree();

  assertEquals(text.read(0), undefined);
  assertEquals(text.count, 0);
  assertEquals(text.line_count, 0);
  assert_tree(text);
});

Deno.test("Create", () => {
  const text = new SliceTree("Lorem ipsum");

  assertEquals(text.read(0), "Lorem ipsum");
  assertEquals(text.count, 11);
  assertEquals(text.line_count, 1);
  assert_tree(text);
});
