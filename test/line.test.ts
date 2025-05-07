import { assertEquals } from "jsr:@std/assert";

import { SliceTree } from "../src/tree.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

Deno.test("Line at index >= line_count", () => {
  const text = new SliceTree();
  text.write(0, "Lorem\nipsum\ndolor\nsit\namet");

  assert_iterator(text.line(4), "amet");
  assert_iterator(text.line(5), "");
  assert_iterator(text.line(6), "");
  assert_tree(text);
});

Deno.test("Line at index < 0", () => {
  const text = new SliceTree();
  text.write(0, "Lorem\nipsum\ndolor\nsit\namet");

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
