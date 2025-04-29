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
  assertEquals(tree.line_count, 0);
  assertEquals(tree.read(0).toArray().join(""), "");
});
