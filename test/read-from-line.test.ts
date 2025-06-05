import { SliceTree } from "../src/tree.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

Deno.test("Line at valid index", () => {
  const text = SliceTree.of_units("Lorem\nipsum\ndolor\nsit\namet");

  assert_iterator(text.read_from_line(0), "Lorem\nipsum\ndolor\nsit\namet");
  assert_iterator(text.read_from_line(1), "ipsum\ndolor\nsit\namet");
  assert_iterator(text.read_from_line(2), "dolor\nsit\namet");
  assert_iterator(text.read_from_line(3), "sit\namet");
  assert_iterator(text.read_from_line(4), "amet");

  assert_tree(text);
});

Deno.test("Line at index >= line_count", () => {
  const text = SliceTree.of_units("Lorem\nipsum\ndolor\nsit\namet");

  assert_iterator(text.read_from_line(4), "amet");
  assert_iterator(text.read_from_line(5), "");
  assert_iterator(text.read_from_line(6), "");

  assert_tree(text);
});

Deno.test("Line at index < 0", () => {
  const text = SliceTree.of_units("Lorem\nipsum\ndolor\nsit\namet");

  assert_iterator(text.read_from_line(0), "Lorem\nipsum\ndolor\nsit\namet");
  assert_iterator(text.read_from_line(-1), "amet");
  assert_iterator(text.read_from_line(-2), "sit\namet");

  assert_tree(text);
});
