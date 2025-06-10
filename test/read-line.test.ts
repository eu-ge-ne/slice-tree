import { assertEquals } from "@std/assert";

import { SliceTree } from "../src/mod.ts";
import { assert_tree } from "./assert.ts";

Deno.test("Line at valid index", () => {
  const text = new SliceTree();

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

  assertEquals(text.read([0, 0], [1, 0]), "Lorem\n");
  assertEquals(text.read([1, 0], [2, 0]), "ipsum\n");
  assertEquals(text.read([2, 0], [3, 0]), "dolor\n");
  assertEquals(text.read([3, 0], [4, 0]), "sit\n");
  assertEquals(text.read([4, 0], [5, 0]), "amet,\n");
  assertEquals(text.read([5, 0], [6, 0]), "consectetur\n");
  assertEquals(text.read([6, 0], [7, 0]), "adipiscing\n");
  assertEquals(text.read([7, 0], [8, 0]), "elit,\n");
  assertEquals(text.read([8, 0], [9, 0]), "sed\n");
  assertEquals(text.read([9, 0], [10, 0]), "do\n");
  assertEquals(text.read([10, 0], [11, 0]), "eiusmod\n");
  assertEquals(text.read([11, 0], [12, 0]), "tempor\n");
  assertEquals(text.read([12, 0], [13, 0]), "incididunt\n");
  assertEquals(text.read([13, 0], [14, 0]), "ut\n");
  assertEquals(text.read([14, 0], [15, 0]), "labore\n");
  assertEquals(text.read([15, 0], [16, 0]), "et\n");
  assertEquals(text.read([16, 0], [17, 0]), "dolore\n");
  assertEquals(text.read([17, 0], [18, 0]), "magna\n");
  assertEquals(text.read([18, 0], [19, 0]), "aliqua.");

  assert_tree(text);
});

Deno.test("Line at index >= line_count", () => {
  const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

  assertEquals(text.read([4, 0], [5, 0]), "amet");
  assertEquals(text.read([5, 0], [6, 0]), "");
  assertEquals(text.read([6, 0], [7, 0]), "");

  assert_tree(text);
});

Deno.test("Line at index < 0", () => {
  const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

  assertEquals(text.read([0, 0], [1, 0]), "Lorem\n");
  assertEquals(text.read([-1, 0], [text.line_count, 0]), "amet");
  assertEquals(text.read([-2, 0], [-1, 0]), "sit\n");

  assert_tree(text);
});

Deno.test("Write adds lines", () => {
  const text = new SliceTree();

  for (let i = 0; i < 10; i += 1) {
    text.write(text.count, `${i}\n`);

    assertEquals(text.line_count, i + 2);
    assertEquals(text.read([i, 0], [i + 1, 0]), `${i}\n`);
  }

  assertEquals(text.line_count, 11);
  assertEquals(text.read([11, 0], [12, 0]), "");

  assert_tree(text);
});
