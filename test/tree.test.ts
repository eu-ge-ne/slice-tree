import { assertEquals, assertInstanceOf } from "jsr:@std/assert";

import { SliceTree } from "../src/tree.ts";
import { assert_tree } from "./assert.ts";

Deno.test("read", () => {
  const text = new SliceTree();

  assertInstanceOf(text.read(0), Iterator);
  assertInstanceOf(text.read(0, 1), Iterator);
});

Deno.test("line", () => {
  const text = new SliceTree();

  assertInstanceOf(text.line(0), Iterator);
});

Deno.test("Empty tree is a valid red-black tree", () => {
  const text = new SliceTree();

  assert_tree(text);
});

Deno.test("Empty tree contains ''", () => {
  const text = new SliceTree();

  assertEquals(text.read(0).toArray().join(""), "");
});

Deno.test("write adds new lines", () => {
  const text = new SliceTree();

  text.write(0, "Lorem ipsum");
  text.write(11, "\ndolor sit amet");

  assertEquals(text.count, 26);
  assertEquals(text.line_count, 2);
  assertEquals(text.read(0).toArray().join(""), "Lorem ipsum\ndolor sit amet");
  assertEquals(text.line(0).toArray().join(""), "Lorem ipsum\n");
  assertEquals(text.line(1).toArray().join(""), "dolor sit amet");

  assert_tree(text);
});

Deno.test("Random write produces valid red-black tree", () => {
  const text = new SliceTree();

  text.write(0, "Lorem");
  text.write(5, " aliqua.");
  text.write(5, " do");
  text.write(8, " ut");
  text.write(5, " consectetur");
  text.write(20, " tempor");
  text.write(5, " dolor");
  text.write(23, " elit,");
  text.write(42, " et");
  text.write(29, " sed");
  text.write(11, " amet,");
  text.write(55, " magna");
  text.write(29, " adipiscing");
  text.write(63, " labore");
  text.write(5, " ipsum");
  text.write(66, " incididunt");
  text.write(59, " eiusmod");
  text.write(98, " dolore");
  text.write(17, " sit");

  assertEquals(text.count, 123);
  assertEquals(
    text.read(0).toArray().join(""),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );

  assert_tree(text);
});

Deno.test("write causing splitting nodes produces valid red-black tree", () => {
  const text = new SliceTree();

  text.write(0, "Lorem aliqua.");
  text.write(5, " ipsum magna");
  text.write(11, " dolor dolore");
  text.write(17, " sit et");
  text.write(21, " amet, labore");
  text.write(27, " consectetur ut");
  text.write(39, " adipiscing incididunt");
  text.write(50, " elit, tempor");
  text.write(56, " sed eiusmod");
  text.write(60, " do");

  assertEquals(text.count, 123);
  assertEquals(
    text.read(0).toArray().join(""),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );

  assert_tree(text);
});

Deno.test("Squential write produces expect number of lines", () => {
  const text = new SliceTree();

  for (let i = 0; i < 10; i += 1) {
    text.write(text.count, `${i}\n`);
  }

  assertEquals(text.count, 20);
  assertEquals(text.line_count, 11);
  assertEquals(
    text.read(0).toArray().join(""),
    "0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n",
  );
  assertEquals(text.line(0).toArray().join(""), "0\n");
  assertEquals(text.line(1).toArray().join(""), "1\n");
  assertEquals(text.line(2).toArray().join(""), "2\n");
  assertEquals(text.line(3).toArray().join(""), "3\n");
  assertEquals(text.line(4).toArray().join(""), "4\n");
  assertEquals(text.line(5).toArray().join(""), "5\n");
  assertEquals(text.line(6).toArray().join(""), "6\n");
  assertEquals(text.line(7).toArray().join(""), "7\n");
  assertEquals(text.line(8).toArray().join(""), "8\n");
  assertEquals(text.line(9).toArray().join(""), "9\n");
  assertEquals(text.line(10).toArray().join(""), "");

  assert_tree(text);
});

Deno.test("line returns empty content for invalid index provided", () => {
  const text = new SliceTree();

  text.write(0, "Lorem ipsum\ndolor sit amet");

  assertEquals(text.line(-1).toArray().join(""), "");
  assertEquals(text.line(2).toArray().join(""), "");

  assert_tree(text);
});
