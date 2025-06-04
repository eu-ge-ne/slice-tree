import { assertEquals } from "@std/assert";

import { SliceTree } from "../src/tree.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

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

  assert_iterator(text.read_line(0, true), "Lorem\n");
  assert_iterator(text.read_line(1, true), "ipsum\n");
  assert_iterator(text.read_line(2, true), "dolor\n");
  assert_iterator(text.read_line(3, true), "sit\n");
  assert_iterator(text.read_line(4, true), "amet,\n");
  assert_iterator(text.read_line(5, true), "consectetur\n");
  assert_iterator(text.read_line(6, true), "adipiscing\n");
  assert_iterator(text.read_line(7, true), "elit,\n");
  assert_iterator(text.read_line(8, true), "sed\n");
  assert_iterator(text.read_line(9, true), "do\n");
  assert_iterator(text.read_line(10, true), "eiusmod\n");
  assert_iterator(text.read_line(11, true), "tempor\n");
  assert_iterator(text.read_line(12, true), "incididunt\n");
  assert_iterator(text.read_line(13, true), "ut\n");
  assert_iterator(text.read_line(14, true), "labore\n");
  assert_iterator(text.read_line(15, true), "et\n");
  assert_iterator(text.read_line(16, true), "dolore\n");
  assert_iterator(text.read_line(17, true), "magna\n");
  assert_iterator(text.read_line(18, true), "aliqua.");

  assert_tree(text);
});

Deno.test("Line at index >= line_count", () => {
  const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

  assert_iterator(text.read_line(4), "amet");
  assert_iterator(text.read_line(5), "");
  assert_iterator(text.read_line(6), "");

  assert_tree(text);
});

Deno.test("Line at index < 0", () => {
  const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

  assert_iterator(text.read_line(0, true), "Lorem\n");
  assert_iterator(text.read_line(-1, true), "amet");
  assert_iterator(text.read_line(-2, true), "sit\n");

  assert_tree(text);
});

Deno.test("Write adds lines", () => {
  const text = new SliceTree();

  for (let i = 0; i < 10; i += 1) {
    text.write(text.count, `${i}\n`);

    assertEquals(text.line_count, i + 2);
    assert_iterator(text.read_line(i), `${i}\n`);
  }

  assertEquals(text.line_count, 11);
  assert_iterator(text.read_line(11), "");

  assert_tree(text);
});
