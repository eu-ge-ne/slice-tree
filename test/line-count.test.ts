import { expect, test } from "vitest";

import { SliceTree } from "../src/tree.ts";

test("Non empty tree without newlines contains 1 line", () => {
  const text = new SliceTree("Lorem ipsum");

  expect(text.line_count).toBe(1);
});

test("Non empty tree contains lines = newline_count + 1", () => {
  const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

  expect(text.line_count).toBe(5);
});
