import { assertEquals } from "@std/assert";

import { SliceTree } from "../src/tree.ts";
import { assert_tree } from "./assert.ts";

Deno.test("Line range at valid index", () => {
  const text = new SliceTree("Lorem😄\nipsum😄\ndolor😄\nsit😄\namet😄");

  assertEquals(text.line_range(0), [0, 7]);
  assertEquals(text.line_range(1), [7, 14]);
  assertEquals(text.line_range(2), [14, 21]);
  assertEquals(text.line_range(3), [21, 26]);
  assertEquals(text.line_range(4), [26, 31]);

  assertEquals(text.count, 31);

  assert_tree(text);
});

Deno.test("Line range at index >= line_count", () => {
  const text = new SliceTree("Lorem😄\nipsum😄\ndolor😄\nsit😄\namet😄");

  assertEquals(text.line_range(4), [26, 31]);
  assertEquals(text.line_range(5), undefined);
  assertEquals(text.line_range(6), undefined);

  assertEquals(text.count, 31);

  assert_tree(text);
});

Deno.test("Line range at index < 0", () => {
  const text = new SliceTree("Lorem😄\nipsum😄\ndolor😄\nsit😄\namet😄");

  assertEquals(text.line_range(0), [0, 7]);
  assertEquals(text.line_range(-1), [26, 31]);
  assertEquals(text.line_range(-2), [21, 26]);

  assertEquals(text.count, 31);

  assert_tree(text);
});
