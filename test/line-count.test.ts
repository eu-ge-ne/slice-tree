import { assertEquals } from "jsr:@std/assert";

import { SliceTree } from "../src/tree.ts";

Deno.test("Non empty tree without newlines contains 1 line", () => {
  const text = new SliceTree("Lorem ipsum");

  assertEquals(text.line_count, 1);
});

Deno.test("Non empty tree contains lines = newline_count + 1", () => {
  const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

  assertEquals(text.line_count, 5);
});
