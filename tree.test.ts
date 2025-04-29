import { assertEquals, assertInstanceOf } from "jsr:@std/assert";

import { SliceTree } from "./tree.ts";

Deno.test("create", () => {
  new SliceTree();
});

Deno.test("count", () => {
  const tree = new SliceTree();

  assertEquals(typeof tree.count, "number");
});

Deno.test("line_count", () => {
  const tree = new SliceTree();

  assertEquals(typeof tree.line_count, "number");
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

Deno.test("empty", () => {
  const tree = new SliceTree();

  assertEquals(tree.count, 0);
  assertEquals(tree.line_count, 1);
  assertEquals(tree.read(0).toArray().join(""), "");
});

Deno.test("write adds characters", () => {
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
