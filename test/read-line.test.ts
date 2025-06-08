import { assertEquals } from "@std/assert";

import { SliceTree } from "../src/mod.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

Deno.test("Line at valid index", () => {
  const text = SliceTree.units();

  text.write(0, "Lorem\naliqua.");
  text.write(6, "ipsum\nmagna\n");
  text.write(12, "dolor\ndolore\n");
  text.write(18, "sit\net\n");
  text.write(22, "amet,\nlabore\n");
  text.write(28, "consectetur\nut\n");
  text.write(40, "adipiscing\nincididunt\n");
  text.write(51, "elit,\ntempor\n");
  text.write(57, "sed\neiusmod\n");
  text.write(61, "do\n");

  assert_iterator(text.read([0, 0], [1, 0]), "Lorem\n");
  assert_iterator(text.read([1, 0], [2, 0]), "ipsum\n");
  assert_iterator(text.read([2, 0], [3, 0]), "dolor\n");
  assert_iterator(text.read([3, 0], [4, 0]), "sit\n");
  assert_iterator(text.read([4, 0], [5, 0]), "amet,\n");
  assert_iterator(text.read([5, 0], [6, 0]), "consectetur\n");
  assert_iterator(text.read([6, 0], [7, 0]), "adipiscing\n");
  assert_iterator(text.read([7, 0], [8, 0]), "elit,\n");
  assert_iterator(text.read([8, 0], [9, 0]), "sed\n");
  assert_iterator(text.read([9, 0], [10, 0]), "do\n");
  assert_iterator(text.read([10, 0], [11, 0]), "eiusmod\n");
  assert_iterator(text.read([11, 0], [12, 0]), "tempor\n");
  assert_iterator(text.read([12, 0], [13, 0]), "incididunt\n");
  assert_iterator(text.read([13, 0], [14, 0]), "ut\n");
  assert_iterator(text.read([14, 0], [15, 0]), "labore\n");
  assert_iterator(text.read([15, 0], [16, 0]), "et\n");
  assert_iterator(text.read([16, 0], [17, 0]), "dolore\n");
  assert_iterator(text.read([17, 0], [18, 0]), "magna\n");
  assert_iterator(text.read([18, 0], [19, 0]), "aliqua.");

  assert_tree(text);
});

Deno.test("Line at index >= line_count", () => {
  const text = SliceTree.units("Lorem\nipsum\ndolor\nsit\namet");

  assert_iterator(text.read([4, 0], [5, 0]), "amet");
  assert_iterator(text.read([5, 0], [6, 0]), undefined);
  assert_iterator(text.read([6, 0], [7, 0]), undefined);

  assert_tree(text);
});

Deno.test("Line at index < 0", () => {
  const text = SliceTree.units("Lorem\nipsum\ndolor\nsit\namet");

  assert_iterator(text.read([0, 0], [1, 0]), "Lorem\n");
  assert_iterator(text.read([-1, 0], [text.line_count, 0]), "amet");
  assert_iterator(text.read([-2, 0], [-1, 0]), "sit\n");

  assert_tree(text);
});

Deno.test("Write adds lines", () => {
  const text = SliceTree.units();

  for (let i = 0; i < 10; i += 1) {
    text.write(text.count, `${i}\n`);

    assertEquals(text.line_count, i + 2);
    assert_iterator(text.read([i, 0], [i + 1, 0]), `${i}\n`);
  }

  assertEquals(text.line_count, 11);
  assert_iterator(text.read([11, 0], [12, 0]), undefined);

  assert_tree(text);
});
