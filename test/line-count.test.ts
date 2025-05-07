import { assertEquals } from "jsr:@std/assert";

import { SliceTree } from "../src/tree.ts";
import { assert_tree } from "./assert.ts";

Deno.test("Empty tree contains 0 lines", () => {
  const text = new SliceTree();

  assertEquals(text.line_count, 0);

  assert_tree(text);
});

Deno.test("Non empty tree without newlines contains 1 line", () => {
  const text = new SliceTree();
  text.write(0, "Lorem ipsum");

  assertEquals(text.line_count, 1);
});

Deno.test("Non empty tree contains lines = newline_count + 1", () => {
  const text = new SliceTree();
  text.write(0, "Lorem\nipsum\ndolor\nsit\namet");

  assertEquals(text.line_count, 5);
});
