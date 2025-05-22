import assert from "node:assert/strict";
import { test } from "node:test";

import { SliceTree } from "../src/tree.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

test("Create empty", () => {
  const text = new SliceTree();

  assert_iterator(text.read(0), "");

  assert.equal(text.count, 0);
  assert.equal(text.line_count, 0);

  assert_tree(text);
});

test("Create with content", () => {
  const text = new SliceTree(
    "Lorem\nipsum\ndolor\nsit\namet,\nconsectetur\nadipiscing\nelit,\nsed\ndo\neiusmod\ntempor\nincididunt\nut\nlabore\net\ndolore\nmagna\naliqua.",
  );

  assert_iterator(
    text.read(0),
    "Lorem\nipsum\ndolor\nsit\namet,\nconsectetur\nadipiscing\nelit,\nsed\ndo\neiusmod\ntempor\nincididunt\nut\nlabore\net\ndolore\nmagna\naliqua.",
  );

  assert.equal(text.count, 123);
  assert.equal(text.line_count, 19);

  assert_tree(text);
});
