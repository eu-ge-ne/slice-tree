import { assertEquals } from "@std/assert";

import { SliceTree } from "../src/tree.ts";
import { assert_tree } from "./assert.ts";

Deno.test("Find line at valid index", () => {
  const text = SliceTree.of_points("Lorem😄\nipsum😄\ndolor😄\nsit😄\namet😄");

  assertEquals(text.find_line(0), [0, 7]);
  assertEquals(text.find_line(1), [7, 14]);
  assertEquals(text.find_line(2), [14, 21]);
  assertEquals(text.find_line(3), [21, 26]);
  assertEquals(text.find_line(4), [26, 31]);

  assertEquals(text.count, 31);

  assert_tree(text);
});

Deno.test("Find line at index == line_count", () => {
  const text = SliceTree.of_points("Lorem😄\nipsum😄\ndolor😄\nsit😄\namet😄");

  assertEquals(text.find_line(4), [26, 31]);
  assertEquals(text.find_line(5), [31, 31]);

  assertEquals(text.count, 31);

  assert_tree(text);
});

Deno.test("Find line at index > line_count", () => {
  const text = SliceTree.of_points("Lorem😄\nipsum😄\ndolor😄\nsit😄\namet😄");

  assertEquals(text.find_line(4), [26, 31]);
  assertEquals(text.find_line(6), undefined);

  assertEquals(text.count, 31);

  assert_tree(text);
});

Deno.test("Find line at index < 0", () => {
  const text = SliceTree.of_points("Lorem😄\nipsum😄\ndolor😄\nsit😄\namet😄");

  assertEquals(text.find_line(0), [0, 7]);
  assertEquals(text.find_line(-1), [26, 31]);
  assertEquals(text.find_line(-2), [21, 26]);

  assertEquals(text.count, 31);

  assert_tree(text);
});
