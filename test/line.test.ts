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

  assert_iterator(text.line(0), "Lorem\n");
  assert_iterator(text.line(1), "ipsum\n");
  assert_iterator(text.line(2), "dolor\n");
  assert_iterator(text.line(3), "sit\n");
  assert_iterator(text.line(4), "amet,\n");
  assert_iterator(text.line(5), "consectetur\n");
  assert_iterator(text.line(6), "adipiscing\n");
  assert_iterator(text.line(7), "elit,\n");
  assert_iterator(text.line(8), "sed\n");
  assert_iterator(text.line(9), "do\n");
  assert_iterator(text.line(10), "eiusmod\n");
  assert_iterator(text.line(11), "tempor\n");
  assert_iterator(text.line(12), "incididunt\n");
  assert_iterator(text.line(13), "ut\n");
  assert_iterator(text.line(14), "labore\n");
  assert_iterator(text.line(15), "et\n");
  assert_iterator(text.line(16), "dolore\n");
  assert_iterator(text.line(17), "magna\n");
  assert_iterator(text.line(18), "aliqua.");
  assert_tree(text);
});

Deno.test("Line at index >= line_count", () => {
  const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

  assert_iterator(text.line(4), "amet");
  assert_iterator(text.line(5), "");
  assert_iterator(text.line(6), "");
  assert_tree(text);
});

Deno.test("Line at index < 0", () => {
  const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

  assert_iterator(text.line(0), "Lorem\n");
  assert_iterator(text.line(-1), "amet");
  assert_iterator(text.line(-2), "sit\n");
  assert_tree(text);
});

Deno.test("Write adds lines", () => {
  const text = new SliceTree();

  for (let i = 0; i < 10; i += 1) {
    text.write(text.count, `${i}\n`);

    assertEquals(text.line_count, i + 2);
    assert_iterator(text.line(i), `${i}\n`);
  }

  assertEquals(text.line_count, 11);
  assert_iterator(text.line(11), "");
  assert_tree(text);
});

Deno.test("Erase removes lines", () => {
  const text = new SliceTree();

  text.write(0, "Lorem");
  text.write(5, "ipsum");
  text.write(5, "\n");
  text.write(11, "\n");

  text.erase(0, 6);
  text.erase(5, 1);

  assertEquals(text.count, 5);
  assertEquals(text.line_count, 1);
  assertEquals(text.read(0).toArray().join(""), "ipsum");
  assertEquals(text.line(0).toArray().join(""), "ipsum");
  assert_tree(text);
});

Deno.test("Erasing newline char removes line", () => {
  const text = new SliceTree(" \n \n");

  assertEquals(text.line_count, 3);

  text.erase(1, 1);

  assertEquals(text.read(0).toArray().join(""), "  \n");
  assertEquals(text.line_count, 2);

  assert_tree(text);
});

Deno.test("Erasing first newline char removes line", () => {
  const text = new SliceTree("\n\n");

  assertEquals(text.line_count, 3);

  text.erase(0, 1);

  assertEquals(text.read(0).toArray().join(""), "\n");
  assertEquals(text.line_count, 2);

  assert_tree(text);
});
