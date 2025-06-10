import { assertEquals } from "@std/assert";

import { SliceTree } from "../src/mod.ts";
import { assert_tree } from "./assert.ts";

Deno.test("Read empty", () => {
  const text = new SliceTree();

  assertEquals(text.read(0), undefined);
  assert_tree(text);
});

Deno.test("Read", () => {
  const text = new SliceTree("Lorem ipsum dolor");

  assertEquals(text.read(6, 12), "ipsum ");
  assert_tree(text);
});

Deno.test("Read at start >= count", () => {
  const text = new SliceTree("Lorem");

  assertEquals(text.read(4), "m");
  assertEquals(text.read(5), undefined);
  assertEquals(text.read(6), undefined);
  assert_tree(text);
});

Deno.test("Read at start < 0", () => {
  const text = new SliceTree("Lorem");

  assertEquals(text.read(0), "Lorem");
  assertEquals(text.read(-1), "m");
  assertEquals(text.read(-2), "em");
  assert_tree(text);
});
