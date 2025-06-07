import { assertEquals } from "@std/assert";

import { SliceTree } from "../src/tree.ts";
import { assert_tree } from "./assert.ts";

Deno.test("Find line at valid index", () => {
  const text = SliceTree.points("Lorem😄\nipsum😄\ndolor😄\nsit😄\namet😄");

  assertEquals(text.to_index([0, 0]), 0);
  assertEquals(text.to_index([1, 0]), 7);
  assertEquals(text.to_index([2, 0]), 14);
  assertEquals(text.to_index([3, 0]), 21);
  assertEquals(text.to_index([4, 0]), 26);

  assertEquals(text.count, 31);

  assert_tree(text);
});

Deno.test("Find line at index == line_count", () => {
  const text = SliceTree.points("Lorem😄\nipsum😄\ndolor😄\nsit😄\namet😄");

  assertEquals(text.to_index([4, 0]), 26);
  assertEquals(text.to_index([5, 0]), undefined);

  assertEquals(text.count, 31);

  assert_tree(text);
});

Deno.test("Find line at index > line_count", () => {
  const text = SliceTree.points("Lorem😄\nipsum😄\ndolor😄\nsit😄\namet😄");

  assertEquals(text.to_index([4, 0]), 26);
  assertEquals(text.to_index([6, 0]), undefined);

  assertEquals(text.count, 31);

  assert_tree(text);
});

Deno.test("Find line at index < 0", () => {
  const text = SliceTree.points("Lorem😄\nipsum😄\ndolor😄\nsit😄\namet😄");

  assertEquals(text.to_index([0, 0]), 0);
  assertEquals(text.to_index([-1, 0]), 26);
  assertEquals(text.to_index([-2, 0]), 21);

  assertEquals(text.count, 31);

  assert_tree(text);
});
