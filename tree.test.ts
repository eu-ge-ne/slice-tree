import { assertEquals, assertInstanceOf } from "jsr:@std/assert";

import { SliceTree } from "./tree.ts";
import { assert_tree } from "./validation.ts";

Deno.test("create", () => {
  new SliceTree();
});

Deno.test("count", () => {
  const tree = new SliceTree();

  assertEquals(tree.count, 0);
});

Deno.test("line_count", () => {
  const tree = new SliceTree();

  assertEquals(tree.line_count, 0);
});

Deno.test("read", () => {
  const tree = new SliceTree();

  assertInstanceOf(tree.read(0), Iterator);
  assertInstanceOf(tree.read(0, 1), Iterator);
});

Deno.test("line", () => {
  const tree = new SliceTree();

  assertInstanceOf(tree.line(0), Iterator);
});

Deno.test("write", () => {
  const tree = new SliceTree();

  tree.write(0, "text");
});

Deno.test("erase", () => {
  const tree = new SliceTree();

  tree.erase(0, 1);
});

Deno.test("empty tree is a valid red-black tree", () => {
  const tree = new SliceTree();

  assert_tree(tree);
});

Deno.test("empty tree contains 0 characters", () => {
  const tree = new SliceTree();

  assertEquals(tree.count, 0);
});

Deno.test("empty tree contains 0 lines", () => {
  const tree = new SliceTree();

  assertEquals(tree.line_count, 0);
});

Deno.test("empty tree contains ''", () => {
  const tree = new SliceTree();

  assertEquals(tree.read(0).toArray().join(""), "");
});

Deno.test("write adds content", () => {
  const tree = new SliceTree();

  tree.write(0, "Lorem ipsum");

  assertEquals(tree.count, 11);
  assertEquals(tree.line_count, 1);
  assertEquals(tree.read(0).toArray().join(""), "Lorem ipsum");
  assertEquals(tree.line(0).toArray().join(""), "Lorem ipsum");
});

Deno.test("write adds new lines", () => {
  const tree = new SliceTree();

  tree.write(0, "Lorem ipsum");
  tree.write(11, "\ndolor sit amet");

  assertEquals(tree.count, 26);
  assertEquals(tree.line_count, 2);
  assertEquals(tree.read(0).toArray().join(""), "Lorem ipsum\ndolor sit amet");
  assertEquals(tree.line(0).toArray().join(""), "Lorem ipsum\n");
  assertEquals(tree.line(1).toArray().join(""), "dolor sit amet");
});

Deno.test("random write produces valid red-black tree", () => {
  const tree = new SliceTree();

  tree.write(0, "Lorem");
  tree.write(5, " aliqua.");
  tree.write(5, " do");
  tree.write(8, " ut");
  tree.write(5, " consectetur");
  tree.write(20, " tempor");
  tree.write(5, " dolor");
  tree.write(23, " elit,");
  tree.write(42, " et");
  tree.write(29, " sed");
  tree.write(11, " amet,");
  tree.write(55, " magna");
  tree.write(29, " adipiscing");
  tree.write(63, " labore");
  tree.write(5, " ipsum");
  tree.write(66, " incididunt");
  tree.write(59, " eiusmod");
  tree.write(98, " dolore");
  tree.write(17, " sit");

  assertEquals(tree.count, 123);
  assertEquals(
    tree.read(0).toArray().join(""),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );

  assert_tree(tree);
});

Deno.test("write causing splitting nodes produces valid red-black tree", () => {
  const tree = new SliceTree();

  tree.write(0, "Lorem aliqua.");
  tree.write(5, " ipsum magna");
  tree.write(11, " dolor dolore");
  tree.write(17, " sit et");
  tree.write(21, " amet, labore");
  tree.write(27, " consectetur ut");
  tree.write(39, " adipiscing incididunt");
  tree.write(50, " elit, tempor");
  tree.write(56, " sed eiusmod");
  tree.write(60, " do");

  assertEquals(tree.count, 123);
  assertEquals(
    tree.read(0).toArray().join(""),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );

  assert_tree(tree);
});

Deno.test("degenerate write produces valid red-black tree", () => {
  const tree = new SliceTree();

  tree.write(0, "Lorem");
  tree.write(tree.count, " ipsum");
  tree.write(tree.count, " dolor");
  tree.write(tree.count, " sit");
  tree.write(tree.count, " amet,");
  tree.write(tree.count, " consectetur");
  tree.write(tree.count, " adipiscing");
  tree.write(tree.count, " elit,");
  tree.write(tree.count, " sed");
  tree.write(tree.count, " do");
  tree.write(tree.count, " eiusmod");
  tree.write(tree.count, " tempor");
  tree.write(tree.count, " incididunt");
  tree.write(tree.count, " ut");
  tree.write(tree.count, " labore");
  tree.write(tree.count, " et");
  tree.write(tree.count, " dolore");
  tree.write(tree.count, " magna");
  tree.write(tree.count, " aliqua.");

  assertEquals(tree.count, 123);
  assertEquals(
    tree.read(0).toArray().join(""),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );

  assert_tree(tree);
});

Deno.test("reverse degenerate write produces valid red-black tree", () => {
  const tree = new SliceTree();

  tree.write(0, " aliqua.");
  tree.write(0, " magna");
  tree.write(0, " dolore");
  tree.write(0, " et");
  tree.write(0, " labore");
  tree.write(0, " ut");
  tree.write(0, " incididunt");
  tree.write(0, " tempor");
  tree.write(0, " eiusmod");
  tree.write(0, " do");
  tree.write(0, " sed");
  tree.write(0, " elit,");
  tree.write(0, " adipiscing");
  tree.write(0, " consectetur");
  tree.write(0, " amet,");
  tree.write(0, " sit");
  tree.write(0, " dolor");
  tree.write(0, " ipsum");
  tree.write(0, "Lorem");

  assertEquals(tree.count, 123);
  assertEquals(
    tree.read(0).toArray().join(""),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );

  assert_tree(tree);
});

Deno.test("erase removes content", () => {
  const tree = new SliceTree();

  tree.write(0, "Lorem ipsum");
  tree.erase(5, 6);

  assertEquals(tree.count, 5);
  assertEquals(tree.line_count, 1);
  assertEquals(tree.read(0).toArray().join(""), "Lorem");
  assertEquals(tree.line(0).toArray().join(""), "Lorem");
});

Deno.test("erase removes lines", () => {
  const tree = new SliceTree();

  tree.write(0, "Lorem ipsum\ndolor sit amet");
  tree.erase(11, 15);

  assertEquals(tree.count, 11);
  assertEquals(tree.line_count, 1);
  assertEquals(tree.read(0).toArray().join(""), "Lorem ipsum");
  assertEquals(tree.line(0).toArray().join(""), "Lorem ipsum");
});

Deno.test("erase head produces valid red-black tree", () => {
  const tree = new SliceTree();

  tree.write(0, "Lorem");
  tree.write(tree.count, " ipsum");
  tree.write(tree.count, " dolor");
  tree.write(tree.count, " sit");
  tree.write(tree.count, " amet,");
  tree.write(tree.count, " consectetur");
  tree.write(tree.count, " adipiscing");
  tree.write(tree.count, " elit,");
  tree.write(tree.count, " sed");
  tree.write(tree.count, " do");
  tree.write(tree.count, " eiusmod");
  tree.write(tree.count, " tempor");
  tree.write(tree.count, " incididunt");
  tree.write(tree.count, " ut");
  tree.write(tree.count, " labore");
  tree.write(tree.count, " et");
  tree.write(tree.count, " dolore");
  tree.write(tree.count, " magna");
  tree.write(tree.count, " aliqua.");

  while (tree.count > 0) {
    tree.erase(0, 1);
  }

  assertEquals(tree.count, 0);
  assertEquals(tree.read(0).toArray().join(""), "");

  assert_tree(tree);
});

Deno.test("erase reversed head produces valid red-black tree", () => {
  const tree = new SliceTree();

  tree.write(0, " aliqua.");
  tree.write(0, " magna");
  tree.write(0, " dolore");
  tree.write(0, " et");
  tree.write(0, " labore");
  tree.write(0, " ut");
  tree.write(0, " incididunt");
  tree.write(0, " tempor");
  tree.write(0, " eiusmod");
  tree.write(0, " do");
  tree.write(0, " sed");
  tree.write(0, " elit,");
  tree.write(0, " adipiscing");
  tree.write(0, " consectetur");
  tree.write(0, " amet,");
  tree.write(0, " sit");
  tree.write(0, " dolor");
  tree.write(0, " ipsum");
  tree.write(0, "Lorem");

  while (tree.count > 0) {
    tree.erase(0, 1);
  }

  assertEquals(tree.count, 0);
  assertEquals(tree.read(0).toArray().join(""), "");

  assert_tree(tree);
});

Deno.test("erase tail produces valid red-black tree", () => {
  const tree = new SliceTree();

  tree.write(0, "Lorem");
  tree.write(tree.count, " ipsum");
  tree.write(tree.count, " dolor");
  tree.write(tree.count, " sit");
  tree.write(tree.count, " amet,");
  tree.write(tree.count, " consectetur");
  tree.write(tree.count, " adipiscing");
  tree.write(tree.count, " elit,");
  tree.write(tree.count, " sed");
  tree.write(tree.count, " do");
  tree.write(tree.count, " eiusmod");
  tree.write(tree.count, " tempor");
  tree.write(tree.count, " incididunt");
  tree.write(tree.count, " ut");
  tree.write(tree.count, " labore");
  tree.write(tree.count, " et");
  tree.write(tree.count, " dolore");
  tree.write(tree.count, " magna");
  tree.write(tree.count, " aliqua.");

  while (tree.count > 0) {
    tree.erase(tree.count - 1, 1);
  }

  assertEquals(tree.count, 0);
  assertEquals(tree.read(0).toArray().join(""), "");

  assert_tree(tree);
});

Deno.test("erase reversed tail produces valid red-black tree", () => {
  const tree = new SliceTree();

  tree.write(0, " aliqua.");
  tree.write(0, " magna");
  tree.write(0, " dolore");
  tree.write(0, " et");
  tree.write(0, " labore");
  tree.write(0, " ut");
  tree.write(0, " incididunt");
  tree.write(0, " tempor");
  tree.write(0, " eiusmod");
  tree.write(0, " do");
  tree.write(0, " sed");
  tree.write(0, " elit,");
  tree.write(0, " adipiscing");
  tree.write(0, " consectetur");
  tree.write(0, " amet,");
  tree.write(0, " sit");
  tree.write(0, " dolor");
  tree.write(0, " ipsum");
  tree.write(0, "Lorem");

  while (tree.count > 0) {
    tree.erase(tree.count - 1, 1);
  }

  assertEquals(tree.count, 0);
  assertEquals(tree.read(0).toArray().join(""), "");

  assert_tree(tree);
});

Deno.test("erase middle nodes produces valid red-black tree", () => {
  const tree = new SliceTree();

  for (let i = 0; i < 5; i += 1) {
    tree.write(0, "a");
    tree.write(Math.floor(tree.count / 2), "b");
    tree.write(Math.floor(tree.count / 3), "c");
  }

  while (tree.count > 0) {
    tree.erase(Math.floor(tree.count / 2), 1);
  }

  assert_tree(tree);
});

Deno.test("erase tail nodes produces valid red-black tree", () => {
  const tree = new SliceTree();

  for (let i = 0; i < 10; i += 1) {
    tree.write(0, "a");
    tree.write(Math.floor(tree.count / 3), "c");
    tree.write(Math.floor(tree.count / 2), "b");
  }

  while (tree.count > 0) {
    tree.erase(tree.count - 1, 1);
  }

  assert_tree(tree);
});

Deno.test("erase causing splitting nodes produces valid red-black tree", () => {
  const tree = new SliceTree();

  tree.write(
    0,
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );

  tree.erase(13, 13);
  tree.erase(26, 13);
  tree.erase(39, 13);
  tree.erase(52, 13);
  tree.erase(11, 11);
  tree.erase(22, 11);
  tree.erase(33, 11);
  tree.erase(44, 11);
  tree.erase(9, 9);
  tree.erase(18, 9);
  tree.erase(7, 7);
  tree.erase(5, 5);
  tree.erase(3, 3);
  tree.erase(1, 1);
  tree.erase(0, 2);

  assertEquals(tree.count, 0);
  assertEquals(tree.read(0).toArray().join(""), "");

  assert_tree(tree);
});

Deno.test("erase all leaves empty content", () => {
  const tree = new SliceTree();

  tree.write(0, "Lorem ipsum\ndolor sit amet");
  tree.erase(0, 26);

  assertEquals(tree.count, 0);
  assertEquals(tree.line_count, 0);
  assertEquals(tree.read(0).toArray().join(""), "");
  assertEquals(tree.line(0).toArray().join(""), "");
});

Deno.test("line returns empty content for invalid index provided", () => {
  const tree = new SliceTree();

  tree.write(0, "Lorem ipsum\ndolor sit amet");

  assertEquals(tree.line(-1).toArray().join(""), "");
  assertEquals(tree.line(2).toArray().join(""), "");
});
