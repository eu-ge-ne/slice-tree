import { assertEquals } from "@std/assert";

import { SliceTree } from "../src/mod.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

Deno.test("Create empty", () => {
  const text = SliceTree.units();

  assert_iterator(text.read(0), undefined);
  assertEquals(text.count, 0);
  assertEquals(text.line_count, 0);

  assert_tree(text);
});

Deno.test("Create as units", () => {
  const text1 = SliceTree.units("A");
  const text2 = SliceTree.units("😄");
  const text3 = SliceTree.units("🤦🏼‍♂️");

  assert_iterator(text1.read(0), "A");
  assert_iterator(text2.read(0), "😄");
  assert_iterator(text3.read(0), "🤦🏼‍♂️");

  assertEquals(text1.count, 1);
  assertEquals(text2.count, 2);
  assertEquals(text3.count, 7);

  assert_tree(text1);
  assert_tree(text2);
  assert_tree(text3);
});

Deno.test("Create as points", () => {
  const text1 = SliceTree.points("A");
  const text2 = SliceTree.points("😄");
  const text3 = SliceTree.points("🤦🏼‍♂️");

  assert_iterator(text1.read(0), "A");
  assert_iterator(text2.read(0), "😄");
  assert_iterator(text3.read(0), "🤦🏼‍♂️");

  assertEquals(text1.count, 1);
  assertEquals(text2.count, 1);
  assertEquals(text3.count, 5);

  assert_tree(text1);
  assert_tree(text2);
  assert_tree(text3);
});

Deno.test("Create as graphemes", () => {
  const text1 = SliceTree.graphemes("A");
  const text2 = SliceTree.graphemes("😄");
  const text3 = SliceTree.graphemes("🤦🏼‍♂️");

  assert_iterator(text1.read(0), "A");
  assert_iterator(text2.read(0), "😄");
  assert_iterator(text3.read(0), "🤦🏼‍♂️");

  assertEquals(text1.count, 1);
  assertEquals(text2.count, 1);
  assertEquals(text3.count, 1);

  assert_tree(text1);
  assert_tree(text2);
  assert_tree(text3);
});
