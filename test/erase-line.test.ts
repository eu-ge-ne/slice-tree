import { assertEquals } from "@std/assert";

import { SliceTree } from "../src/tree.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

Deno.test("Erase line", () => {
  const text = SliceTree.points("Lorem😄\nipsum😄\ndolor😄\nsit😄\namet😄");

  assertEquals(text.line_count, 5);

  text.erase_line(4);

  assert_iterator(text.read(0), "Lorem😄\nipsum😄\ndolor😄\nsit😄\n");
  assertEquals(text.count, 26);
  assertEquals(text.line_count, 5);

  text.erase_line(3);

  assert_iterator(text.read(0), "Lorem😄\nipsum😄\ndolor😄\n");
  assertEquals(text.count, 21);
  assertEquals(text.line_count, 4);

  text.erase_line(2);

  assert_iterator(text.read(0), "Lorem😄\nipsum😄\n");
  assertEquals(text.count, 14);
  assertEquals(text.line_count, 3);

  text.erase_line(1);

  assert_iterator(text.read(0), "Lorem😄\n");
  assertEquals(text.count, 7);
  assertEquals(text.line_count, 2);

  assert_tree(text);
});
