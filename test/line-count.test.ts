import { assertEquals } from "@std/assert";

import { SliceTree } from "../src/mod.ts";

Deno.test("0 newlines", () => {
  const text1 = new SliceTree("A");
  const text2 = new SliceTree("😄");
  const text3 = new SliceTree("🤦🏼‍♂️");

  assertEquals(text1.line_count, 1);
  assertEquals(text2.line_count, 1);
  assertEquals(text3.line_count, 1);
});

Deno.test("LF", () => {
  const text1 = new SliceTree("A\nA");
  const text2 = new SliceTree("😄\n😄");
  const text3 = new SliceTree("🤦🏼‍♂️\n🤦🏼‍♂️");

  assertEquals(text1.line_count, 2);
  assertEquals(text2.line_count, 2);
  assertEquals(text3.line_count, 2);
});

Deno.test("CRLF", () => {
  const text1 = new SliceTree("A\r\nA");
  const text2 = new SliceTree("😄\r\n😄");
  const text3 = new SliceTree("🤦🏼‍♂️\r\n🤦🏼‍♂️");

  assertEquals(text1.line_count, 2);
  assertEquals(text2.line_count, 2);
  assertEquals(text3.line_count, 2);
});
