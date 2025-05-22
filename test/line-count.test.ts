import assert from "node:assert/strict";
import { test } from "node:test";

import { SliceTree } from "../src/tree.ts";

test("Non empty tree without newlines contains 1 line", () => {
  const text = new SliceTree("Lorem ipsum");

  assert.equal(text.line_count, 1);
});

test("Non empty tree contains lines = newline_count + 1", () => {
  const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

  assert.equal(text.line_count, 5);
});
