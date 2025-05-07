import { assertEquals, assertInstanceOf } from "jsr:@std/assert";

import { SliceTree } from "../src/tree.ts";
import { assert_tree } from "./assert.ts";

Deno.test("line", () => {
  const text = new SliceTree();

  assertInstanceOf(text.line(0), Iterator);
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
