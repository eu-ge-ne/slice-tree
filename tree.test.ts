import { assertEquals, assertInstanceOf } from "jsr:@std/assert";

import { SliceTree } from "./tree.ts";
import { assert_tree } from "./validation.ts";

Deno.test("create", () => {
  new SliceTree();
});

Deno.test("count", () => {
  const text = new SliceTree();

  assertEquals(text.count, 0);
});

Deno.test("line_count", () => {
  const text = new SliceTree();

  assertEquals(text.line_count, 0);
});

Deno.test("read", () => {
  const text = new SliceTree();

  assertInstanceOf(text.read(0), Iterator);
  assertInstanceOf(text.read(0, 1), Iterator);
});

Deno.test("line", () => {
  const text = new SliceTree();

  assertInstanceOf(text.line(0), Iterator);
});

Deno.test("write", () => {
  const text = new SliceTree();

  text.write(0, "text");
});

Deno.test("erase", () => {
  const text = new SliceTree();

  text.erase(0, 1);
});

Deno.test("empty tree is a valid red-black tree", () => {
  const text = new SliceTree();

  assert_tree(text);
});

Deno.test("empty tree contains 0 characters", () => {
  const text = new SliceTree();

  assertEquals(text.count, 0);
});

Deno.test("empty tree contains 0 lines", () => {
  const text = new SliceTree();

  assertEquals(text.line_count, 0);
});

Deno.test("empty tree contains ''", () => {
  const text = new SliceTree();

  assertEquals(text.read(0).toArray().join(""), "");
});

Deno.test("write adds content", () => {
  const text = new SliceTree();

  text.write(0, "Lorem ipsum");

  assertEquals(text.count, 11);
  assertEquals(text.line_count, 1);
  assertEquals(text.read(0).toArray().join(""), "Lorem ipsum");
  assertEquals(text.line(0).toArray().join(""), "Lorem ipsum");
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
});

Deno.test("random write produces valid red-black tree", () => {
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

Deno.test("degenerate write produces valid red-black tree", () => {
  const text = new SliceTree();

  text.write(0, "Lorem");
  text.write(text.count, " ipsum");
  text.write(text.count, " dolor");
  text.write(text.count, " sit");
  text.write(text.count, " amet,");
  text.write(text.count, " consectetur");
  text.write(text.count, " adipiscing");
  text.write(text.count, " elit,");
  text.write(text.count, " sed");
  text.write(text.count, " do");
  text.write(text.count, " eiusmod");
  text.write(text.count, " tempor");
  text.write(text.count, " incididunt");
  text.write(text.count, " ut");
  text.write(text.count, " labore");
  text.write(text.count, " et");
  text.write(text.count, " dolore");
  text.write(text.count, " magna");
  text.write(text.count, " aliqua.");

  assertEquals(text.count, 123);
  assertEquals(
    text.read(0).toArray().join(""),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );

  assert_tree(text);
});

Deno.test("reverse degenerate write produces valid red-black tree", () => {
  const text = new SliceTree();

  text.write(0, " aliqua.");
  text.write(0, " magna");
  text.write(0, " dolore");
  text.write(0, " et");
  text.write(0, " labore");
  text.write(0, " ut");
  text.write(0, " incididunt");
  text.write(0, " tempor");
  text.write(0, " eiusmod");
  text.write(0, " do");
  text.write(0, " sed");
  text.write(0, " elit,");
  text.write(0, " adipiscing");
  text.write(0, " consectetur");
  text.write(0, " amet,");
  text.write(0, " sit");
  text.write(0, " dolor");
  text.write(0, " ipsum");
  text.write(0, "Lorem");

  assertEquals(text.count, 123);
  assertEquals(
    text.read(0).toArray().join(""),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );

  assert_tree(text);
});

Deno.test("erase removes content", () => {
  const text = new SliceTree();

  text.write(0, "Lorem ipsum");
  text.erase(5, 6);

  assertEquals(text.count, 5);
  assertEquals(text.line_count, 1);
  assertEquals(text.read(0).toArray().join(""), "Lorem");
  assertEquals(text.line(0).toArray().join(""), "Lorem");

  assert_tree(text);
});

Deno.test("erase removes lines", () => {
  const text = new SliceTree();

  text.write(0, "Lorem ipsum\ndolor sit amet");
  text.erase(11, 15);

  assertEquals(text.count, 11);
  assertEquals(text.line_count, 1);
  assertEquals(text.read(0).toArray().join(""), "Lorem ipsum");
  assertEquals(text.line(0).toArray().join(""), "Lorem ipsum");

  assert_tree(text);
});

Deno.test("erase all leaves empty content", () => {
  const text = new SliceTree();

  text.write(0, "Lorem ipsum\ndolor sit amet");
  text.erase(0, 26);

  assertEquals(text.count, 0);
  assertEquals(text.line_count, 0);
  assertEquals(text.read(0).toArray().join(""), "");
  assertEquals(text.line(0).toArray().join(""), "");

  assert_tree(text);
});

Deno.test("erase from 1 node", () => {
  const text = new SliceTree();

  text.write(0, "Lorem");
  text.erase(1, 3);

  assertEquals(text.count, 2);
  assertEquals(text.line_count, 1);
  assertEquals(text.read(0).toArray().join(""), "Lm");
  assertEquals(text.line(0).toArray().join(""), "Lm");

  assert_tree(text);
});

Deno.test("erase from 2 nodes", () => {
  const text = new SliceTree();

  text.write(0, "Lorem");
  text.write(5, " ipsum");
  text.erase(4, 3);

  assertEquals(text.count, 8);
  assertEquals(text.line_count, 1);
  assertEquals(text.read(0).toArray().join(""), "Lorepsum");
  assertEquals(text.line(0).toArray().join(""), "Lorepsum");

  assert_tree(text);
});

// TODO

Deno.test("erase from 3 nodes", () => {
  const text = new SliceTree();

  text.write(0, "Lorem");
  text.write(5, " ipsum");
  text.write(11, " dolor");
  text.erase(4, 3);

  assertEquals(text.count, 8);
  assertEquals(text.line_count, 1);
  assertEquals(text.read(0).toArray().join(""), "Lorepsum");
  assertEquals(text.line(0).toArray().join(""), "Lorepsum");

  assert_tree(text);
});

Deno.test("erase from 4 nodes", () => {
  const text = new SliceTree();

  text.write(0, "Lorem");
  text.write(5, " ");
  text.write(6, "ipsum");
  text.write(11, " dolor");
  text.erase(4, 9);

  assertEquals(text.count, 8);
  assertEquals(text.line_count, 1);
  assertEquals(text.read(0).toArray().join(""), "Loreolor");
  assertEquals(text.line(0).toArray().join(""), "Loreolor");

  assert_tree(text);
});

Deno.test("erase from 5 nodes", () => {
  const text = new SliceTree();

  text.write(0, "Lorem");
  text.write(5, " ");
  text.write(6, "ipsum");
  text.write(11, " ");
  text.write(12, "dolor");
  text.erase(4, 9);

  assertEquals(text.count, 8);
  assertEquals(text.line_count, 1);
  assertEquals(text.read(0).toArray().join(""), "Loreolor");
  assertEquals(text.line(0).toArray().join(""), "Loreolor");

  assert_tree(text);
});

Deno.test("erase from 6 nodes", () => {
  const text = new SliceTree();

  text.write(0, "Lorem");
  text.write(5, " ");
  text.write(6, "ipsum");
  text.write(11, " ");
  text.write(12, "dolor");
  text.write(17, " sit");
  text.erase(4, 15);

  assertEquals(text.count, 6);
  assertEquals(text.line_count, 1);
  assertEquals(text.read(0).toArray().join(""), "Loreit");
  assertEquals(text.line(0).toArray().join(""), "Loreit");

  assert_tree(text);
});

Deno.test("erase from 7 nodes", () => {
  const text = new SliceTree();

  text.write(0, "Lorem");
  text.write(5, " ");
  text.write(6, "ipsum");
  text.write(11, " ");
  text.write(12, "dolor");
  text.write(17, " ");
  text.write(18, "sit");
  text.erase(4, 15);

  assertEquals(text.count, 6);
  assertEquals(text.line_count, 1);
  assertEquals(text.read(0).toArray().join(""), "Loreit");
  assertEquals(text.line(0).toArray().join(""), "Loreit");

  assert_tree(text);
});

/*
Deno.test("erase head produces valid red-black tree", () => {
  const text = new SliceTree();

  text.write(0, "Lorem");
  text.write(text.count, " ipsum");
  text.write(text.count, " dolor");
  text.write(text.count, " sit");
  text.write(text.count, " amet,");
  text.write(text.count, " consectetur");
  text.write(text.count, " adipiscing");
  text.write(text.count, " elit,");
  text.write(text.count, " sed");
  text.write(text.count, " do");
  text.write(text.count, " eiusmod");
  text.write(text.count, " tempor");
  text.write(text.count, " incididunt");
  text.write(text.count, " ut");
  text.write(text.count, " labore");
  text.write(text.count, " et");
  text.write(text.count, " dolore");
  text.write(text.count, " magna");
  text.write(text.count, " aliqua.");

  while (text.count > 0) {
    text.erase(0, 1);
  }

  assertEquals(text.count, 0);
  assertEquals(text.read(0).toArray().join(""), "");

  assert_tree(text);
});

Deno.test("erase reversed head produces valid red-black tree", () => {
  const text = new SliceTree();

  text.write(0, " aliqua.");
  text.write(0, " magna");
  text.write(0, " dolore");
  text.write(0, " et");
  text.write(0, " labore");
  text.write(0, " ut");
  text.write(0, " incididunt");
  text.write(0, " tempor");
  text.write(0, " eiusmod");
  text.write(0, " do");
  text.write(0, " sed");
  text.write(0, " elit,");
  text.write(0, " adipiscing");
  text.write(0, " consectetur");
  text.write(0, " amet,");
  text.write(0, " sit");
  text.write(0, " dolor");
  text.write(0, " ipsum");
  text.write(0, "Lorem");

  while (text.count > 0) {
    text.erase(0, 1);
  }

  assertEquals(text.count, 0);
  assertEquals(text.read(0).toArray().join(""), "");

  assert_tree(text);
});

Deno.test("erase tail produces valid red-black tree", () => {
  const text = new SliceTree();

  text.write(0, "Lorem");
  text.write(text.count, " ipsum");
  text.write(text.count, " dolor");
  text.write(text.count, " sit");
  text.write(text.count, " amet,");
  text.write(text.count, " consectetur");
  text.write(text.count, " adipiscing");
  text.write(text.count, " elit,");
  text.write(text.count, " sed");
  text.write(text.count, " do");
  text.write(text.count, " eiusmod");
  text.write(text.count, " tempor");
  text.write(text.count, " incididunt");
  text.write(text.count, " ut");
  text.write(text.count, " labore");
  text.write(text.count, " et");
  text.write(text.count, " dolore");
  text.write(text.count, " magna");
  text.write(text.count, " aliqua.");

  while (text.count > 0) {
    text.erase(text.count - 1, 1);
  }

  assertEquals(text.count, 0);
  assertEquals(text.read(0).toArray().join(""), "");

  assert_tree(text);
});

Deno.test("erase reversed tail produces valid red-black tree", () => {
  const text = new SliceTree();

  text.write(0, " aliqua.");
  text.write(0, " magna");
  text.write(0, " dolore");
  text.write(0, " et");
  text.write(0, " labore");
  text.write(0, " ut");
  text.write(0, " incididunt");
  text.write(0, " tempor");
  text.write(0, " eiusmod");
  text.write(0, " do");
  text.write(0, " sed");
  text.write(0, " elit,");
  text.write(0, " adipiscing");
  text.write(0, " consectetur");
  text.write(0, " amet,");
  text.write(0, " sit");
  text.write(0, " dolor");
  text.write(0, " ipsum");
  text.write(0, "Lorem");

  while (text.count > 0) {
    text.erase(text.count - 1, 1);
  }

  assertEquals(text.count, 0);
  assertEquals(text.read(0).toArray().join(""), "");

  assert_tree(text);
});

Deno.test("erase middle nodes produces valid red-black tree", () => {
  const text = new SliceTree();

  for (let i = 0; i < 5; i += 1) {
    text.write(0, "a");
    text.write(Math.floor(text.count / 2), "b");
    text.write(Math.floor(text.count / 3), "c");
  }

  while (text.count > 0) {
    text.erase(Math.floor(text.count / 2), 1);
  }

  assert_tree(text);
});

Deno.test("erase tail nodes produces valid red-black tree", () => {
  const text = new SliceTree();

  for (let i = 0; i < 10; i += 1) {
    text.write(0, "a");
    text.write(Math.floor(text.count / 3), "c");
    text.write(Math.floor(text.count / 2), "b");
  }

  while (text.count > 0) {
    text.erase(text.count - 1, 1);
  }

  assert_tree(text);
});

Deno.test("erase causing splitting nodes produces valid red-black tree", () => {
  const text = new SliceTree();

  text.write(
    0,
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );

  text.erase(13, 13);
  text.erase(26, 13);
  text.erase(39, 13);
  text.erase(52, 13);
  text.erase(11, 11);
  text.erase(22, 11);
  text.erase(33, 11);
  text.erase(44, 11);
  text.erase(9, 9);
  text.erase(18, 9);
  text.erase(7, 7);
  text.erase(5, 5);
  text.erase(3, 3);
  text.erase(1, 1);
  text.erase(0, 2);

  assertEquals(text.count, 0);
  assertEquals(text.read(0).toArray().join(""), "");

  assert_tree(text);
});
*/

Deno.test("line returns empty content for invalid index provided", () => {
  const text = new SliceTree();

  text.write(0, "Lorem ipsum\ndolor sit amet");

  assertEquals(text.line(-1).toArray().join(""), "");
  assertEquals(text.line(2).toArray().join(""), "");
});
