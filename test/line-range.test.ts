import { assertEquals } from "@std/assert";

import { SliceTree } from "../src/tree.ts";
import { assert_tree } from "./assert.ts";

Deno.test("Line range at valid index", () => {
  const text = new SliceTree(
    "Lorem\nipsum\ndolor\nsit\namet,\nconsectetur\nadipiscing\nelit,\nsed\ndo\neiusmod\ntempor\nincididunt\nut\nlabore\net\ndolore\nmagna\naliqua.",
  );

  assertEquals(text.line_range(0), [0, 6]);
  assertEquals(text.line_range(1), [6, 12]);
  assertEquals(text.line_range(2), [12, 18]);
  assertEquals(text.line_range(3), [18, 22]);
  assertEquals(text.line_range(4), [22, 28]);
  assertEquals(text.line_range(5), [28, 40]);
  assertEquals(text.line_range(6), [40, 51]);
  assertEquals(text.line_range(7), [51, 57]);
  assertEquals(text.line_range(8), [57, 61]);
  assertEquals(text.line_range(9), [61, 64]);
  assertEquals(text.line_range(10), [64, 72]);
  assertEquals(text.line_range(11), [72, 79]);
  assertEquals(text.line_range(12), [79, 90]);
  assertEquals(text.line_range(13), [90, 93]);
  assertEquals(text.line_range(14), [93, 100]);
  assertEquals(text.line_range(15), [100, 103]);
  assertEquals(text.line_range(16), [103, 110]);
  assertEquals(text.line_range(17), [110, 116]);
  assertEquals(text.line_range(18), [116, undefined]);
  assert_tree(text);
});

Deno.test("Line range at index >= line_count", () => {
  const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

  assertEquals(text.line_range(4), [22, undefined]);
  assertEquals(text.line_range(5), undefined);
  assertEquals(text.line_range(6), undefined);
  assert_tree(text);
});

Deno.test("Line range at index < 0", () => {
  const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

  assertEquals(text.line_range(0), [0, 6]);
  assertEquals(text.line_range(-1), [22, undefined]);
  assertEquals(text.line_range(-2), [18, 22]);
  assert_tree(text);
});
