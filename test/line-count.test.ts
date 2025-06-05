import { assertEquals } from "@std/assert";

import { SliceTree } from "../src/tree.ts";

Deno.test("Non empty tree without newlines contains 1 line", () => {
  const text = SliceTree.of_units("Lorem ipsum");

  assertEquals(text.line_count, 1);
});

Deno.test("Non empty tree contains lines = newline_count + 1", () => {
  const text = SliceTree.of_units("Lorem\nipsum\ndolor\nsit\namet");

  assertEquals(text.line_count, 5);
});
