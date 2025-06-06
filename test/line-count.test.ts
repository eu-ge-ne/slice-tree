import { assertEquals } from "@std/assert";

import { SliceTree } from "../src/tree.ts";

Deno.test("0 newlines", () => {
  const text1 = SliceTree.units("A");
  const text2 = SliceTree.points("😄");
  const text3 = SliceTree.graphemes("🤦🏼‍♂️");

  assertEquals(text1.line_count, 1);
  assertEquals(text2.line_count, 1);
  assertEquals(text3.line_count, 1);
});

Deno.test("LF", () => {
  const text1 = SliceTree.units("A\nA");
  const text2 = SliceTree.points("😄\n😄");
  const text3 = SliceTree.graphemes("🤦🏼‍♂️\n🤦🏼‍♂️");

  assertEquals(text1.line_count, 2);
  assertEquals(text2.line_count, 2);
  assertEquals(text3.line_count, 2);
});

Deno.test("CRLF", () => {
  const text1 = SliceTree.units("A\r\nA");
  const text2 = SliceTree.points("😄\r\n😄");
  const text3 = SliceTree.graphemes("🤦🏼‍♂️\r\n🤦🏼‍♂️");

  assertEquals(text1.line_count, 2);
  assertEquals(text2.line_count, 2);
  assertEquals(text3.line_count, 2);
});
