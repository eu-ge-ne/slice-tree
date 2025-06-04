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

  assert_iterator(text.read_line(0), "Lorem\n");
  assert_iterator(text.read_line(1), "ipsum\n");
  assert_iterator(text.read_line(2), "dolor\n");
  assert_iterator(text.read_line(3), "sit\n");
  assert_iterator(text.read_line(4), "amet,\n");
  assert_iterator(text.read_line(5), "consectetur\n");
  assert_iterator(text.read_line(6), "adipiscing\n");
  assert_iterator(text.read_line(7), "elit,\n");
  assert_iterator(text.read_line(8), "sed\n");
  assert_iterator(text.read_line(9), "do\n");
  assert_iterator(text.read_line(10), "eiusmod\n");
  assert_iterator(text.read_line(11), "tempor\n");
  assert_iterator(text.read_line(12), "incididunt\n");
  assert_iterator(text.read_line(13), "ut\n");
  assert_iterator(text.read_line(14), "labore\n");
  assert_iterator(text.read_line(15), "et\n");
  assert_iterator(text.read_line(16), "dolore\n");
  assert_iterator(text.read_line(17), "magna\n");
  assert_iterator(text.read_line(18), "aliqua.");

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

  assert_iterator(text.read_line(0), "Lorem\n");
  assert_iterator(text.read_line(-1), "amet");
  assert_iterator(text.read_line(-2), "sit\n");

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
