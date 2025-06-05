import { assertEquals } from "@std/assert";

import { SliceTree } from "../src/tree.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

Deno.test("Create empty", () => {
  const text = SliceTree.of_code_units();

  assert_iterator(text.read(0), "");
  assertEquals(text.count, 0);
  assertEquals(text.line_count, 0);

  assert_tree(text);
});

Deno.test("Create with code_units", () => {
  const text = SliceTree.of_code_units("Lorem \nipsum \ndolor \nsit \namet");

  assert_iterator(text.read(0), "Lorem \nipsum \ndolor \nsit \namet");
  assertEquals(text.count, 30);
  assertEquals(text.line_count, 5);

  assert_tree(text);
});

Deno.test("Create with code_points", () => {
  const text = SliceTree.of_code_points(
    "Lorem😄\nipsum😄\ndolor😄\nsit😄\namet",
  );

  assert_iterator(text.read(0), "Lorem😄\nipsum😄\ndolor😄\nsit😄\namet");
  assertEquals(text.count, 30);
  assertEquals(text.line_count, 5);

  assert_tree(text);
});
