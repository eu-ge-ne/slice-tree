import { expect, test } from "vitest";

import * as mod from "../src/mod.ts";
import { SliceTree } from "../src/tree.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

test("Create empty", () => {
  const text = new SliceTree();

  assert_iterator(text.read(0), "");

  expect(text.count).toBe(0);
  expect(text.line_count).toBe(0);

  assert_tree(text);
});

test("Create empty from mod.ts", () => {
  const text = new mod.SliceTree();

  assert_iterator(text.read(0), "");

  expect(text.count).toBe(0);
  expect(text.line_count).toBe(0);

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

  expect(text.count).toBe(123);
  expect(text.line_count).toBe(19);

  assert_tree(text);
});
