import { SliceTree } from "../src/mod.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

Deno.test("Read empty", () => {
  const text = new SliceTree();

  assert_iterator(text.read(0), undefined);
  assert_tree(text);
});

Deno.test("Read", () => {
  const text = new SliceTree("Lorem ipsum dolor");

  assert_iterator(text.read(6)?.take(6), "ipsum ");
  assert_tree(text);
});

Deno.test("Read at start >= count", () => {
  const text = new SliceTree("Lorem");

  assert_iterator(text.read(4), "m");
  assert_iterator(text.read(5), undefined);
  assert_iterator(text.read(6), undefined);

  assert_tree(text);
});

Deno.test("Read at start < 0", () => {
  const text = new SliceTree("Lorem");

  assert_iterator(text.read(0), "Lorem");
  assert_iterator(text.read(-1), "m");
  assert_iterator(text.read(-2), "em");

  assert_tree(text);
});
