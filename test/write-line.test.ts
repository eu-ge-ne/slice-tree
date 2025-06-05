import { SliceTree } from "../src/tree.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

Deno.test("Write to 0 line", () => {
  const text = SliceTree.of_units();

  text.write_line(0, 0, "Lorem ipsum");

  assert_iterator(text.read(0), "Lorem ipsum");
  assert_iterator(text.read_line(0), "Lorem ipsum");

  assert_tree(text);
});

Deno.test("Write to a line", () => {
  const text = SliceTree.of_units();
  text.write(0, "Lorem");

  text.write_line(0, 5, " ipsum");

  assert_iterator(text.read(0), "Lorem ipsum");
  assert_iterator(text.read_line(0), "Lorem ipsum");

  assert_tree(text);
});

Deno.test("Write to a line which does not exist", () => {
  const text = SliceTree.of_units();

  text.write_line(1, 0, "Lorem ipsum");

  assert_iterator(text.read(0), "");
  assert_iterator(text.read_line(0), "");

  assert_tree(text);
});

Deno.test("Write to a column which does not exist", () => {
  const text = SliceTree.of_units();

  text.write_line(0, 1, "Lorem ipsum");

  assert_iterator(text.read(0), "");
  assert_iterator(text.read_line(0), "");

  assert_tree(text);
});
