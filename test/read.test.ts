import { SliceTree } from "../src/mod.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

Deno.test("Read empty", () => {
  const text = SliceTree.units();

  assert_iterator(text.read(0), undefined);

  assert_tree(text);
});

Deno.test("Read units", () => {
  const text = SliceTree.units("Lorem ipsum dolor");

  assert_iterator(text.read(6)?.take(6), "ipsum ");

  assert_tree(text);
});

Deno.test("Read points", () => {
  const text = SliceTree.points("Lorem😄ipsum😄dolor");

  assert_iterator(text.read(6)?.take(6), "ipsum😄");

  assert_tree(text);
});

Deno.test("Read graphemes", () => {
  const text = SliceTree.graphemes("Lorem🤦ipsum🤦dolor");

  assert_iterator(text.read(6)?.take(6), "ipsum🤦");

  assert_tree(text);
});

Deno.test("Read at start >= count", () => {
  const text = SliceTree.units("Lorem");

  assert_iterator(text.read(4), "m");
  assert_iterator(text.read(5), undefined);
  assert_iterator(text.read(6), undefined);

  assert_tree(text);
});

Deno.test("Read at start < 0", () => {
  const text = SliceTree.units("Lorem");

  assert_iterator(text.read(0), "Lorem");
  assert_iterator(text.read(-1), "m");
  assert_iterator(text.read(-2), "em");

  assert_tree(text);
});
