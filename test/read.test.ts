import { SliceTree } from "../src/tree.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

Deno.test("Read empty", () => {
  const text = SliceTree.of_code_units();

  assert_iterator(text.read(0), "");

  assert_tree(text);
});

Deno.test("Read", () => {
  const text = SliceTree.of_code_units("Lorem😄ipsum😄dolor");

  assert_iterator(text.read(6).take(6), "ipsum😄");

  assert_tree(text);
});

Deno.test("Read at start >= count", () => {
  const text = SliceTree.of_code_units("Lorem");

  assert_iterator(text.read(4), "m");
  assert_iterator(text.read(5), "");
  assert_iterator(text.read(6), "");

  assert_tree(text);
});

Deno.test("Read at start < 0", () => {
  const text = SliceTree.of_code_units("Lorem");

  assert_iterator(text.read(0), "Lorem");
  assert_iterator(text.read(-1), "m");
  assert_iterator(text.read(-2), "em");

  assert_tree(text);
});
