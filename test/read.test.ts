import assert from "node:assert/strict";
import { test } from "node:test";

import { SliceTree } from "../src/tree.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

test("Read empty", () => {
  const text = new SliceTree();

  assert_iterator(text.read(0), "");
  assert_tree(text);
});

test("Read at start >= count", () => {
  const text = new SliceTree("Lorem");

  assert_iterator(text.read(4), "m");
  assert_iterator(text.read(5), "");
  assert_iterator(text.read(6), "");
  assert_tree(text);
});

test("Read at start < 0", () => {
  const text = new SliceTree("Lorem");

  assert_iterator(text.read(0), "Lorem");
  assert_iterator(text.read(-1), "m");
  assert_iterator(text.read(-2), "em");
  assert_tree(text);
});

test("Read up to end >= count", () => {
  const text = new SliceTree("Lorem");

  assert_iterator(text.read(0, 4), "Lore");
  assert_iterator(text.read(0, 5), "Lorem");
  assert_iterator(text.read(0, 6), "Lorem");
  assert_tree(text);
});

test("Read up to end < 0", () => {
  const text = new SliceTree("Lorem");

  assert_iterator(text.read(0, -1), "Lore");
  assert_iterator(text.read(0, -2), "Lor");
  assert_tree(text);
});

test("Read with end <= start", () => {
  const text = new SliceTree("Lorem");

  assert_iterator(text.read(2, 3), "r");
  assert_iterator(text.read(2, 2), "");
  assert_iterator(text.read(2, 1), "");
  assert_tree(text);
});
