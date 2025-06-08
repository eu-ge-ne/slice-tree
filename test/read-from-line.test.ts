import { SliceTree } from "../src/mod.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

Deno.test("Line at valid index", () => {
  const text = SliceTree.units("Lorem\nipsum\ndolor\nsit\namet");

  assert_iterator(text.read([0, 0]), "Lorem\nipsum\ndolor\nsit\namet");
  assert_iterator(text.read([1, 0]), "ipsum\ndolor\nsit\namet");
  assert_iterator(text.read([2, 0]), "dolor\nsit\namet");
  assert_iterator(text.read([3, 0]), "sit\namet");
  assert_iterator(text.read([4, 0]), "amet");

  assert_tree(text);
});

Deno.test("Line at index >= line_count", () => {
  const text = SliceTree.units("Lorem\nipsum\ndolor\nsit\namet");

  assert_iterator(text.read([4, 0]), "amet");
  assert_iterator(text.read([5, 0]), undefined);
  assert_iterator(text.read([6, 0]), undefined);

  assert_tree(text);
});

Deno.test("Line at index < 0", () => {
  const text = SliceTree.units("Lorem\nipsum\ndolor\nsit\namet");

  assert_iterator(text.read([0, 0]), "Lorem\nipsum\ndolor\nsit\namet");
  assert_iterator(text.read([-1, 0]), "amet");
  assert_iterator(text.read([-2, 0]), "sit\namet");

  assert_tree(text);
});
