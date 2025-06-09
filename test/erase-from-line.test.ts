import { assertEquals } from "@std/assert";

import { SliceTree } from "../src/mod.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

Deno.test("Erase from line", () => {
  const text = new SliceTree("Lorem \nipsum \ndolor \nsit \namet");

  assertEquals(text.line_count, 5);

  text.erase([3, 0]);

  assert_iterator(text.read(0), "Lorem \nipsum \ndolor \n");
  assertEquals(text.count, 21);
  assertEquals(text.line_count, 4);

  text.erase([1, 0]);

  assert_iterator(text.read(0), "Lorem \n");
  assertEquals(text.count, 7);
  assertEquals(text.line_count, 2);

  assert_tree(text);
});
