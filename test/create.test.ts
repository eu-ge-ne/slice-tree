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

Deno.test("Create with content", () => {
  const text = SliceTree.of_code_units("Lorem\nipsum\ndolor\nsit\namet");

  assert_iterator(text.read(0), "Lorem\nipsum\ndolor\nsit\namet");
  assertEquals(text.count, 26);
  assertEquals(text.line_count, 5);

  assert_tree(text);
});

Deno.test("Create with wide char", () => {
  const text = SliceTree.of_code_units("😄");

  assert_iterator(text.read(0), "😄");
  assertEquals(text.count, 1);
  assertEquals(text.line_count, 1);

  assert_tree(text);
});
