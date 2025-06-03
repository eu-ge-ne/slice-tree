import { assertEquals } from "@std/assert";

import { Buffer } from "../src/buffer.ts";

Deno.test("parse no newlines", () => {
  const buffer = new Buffer("Lorem ipsum");

  assertEquals(buffer.eol_starts, []);
  assertEquals(buffer.eol_ends, []);
});

Deno.test("parse \n", () => {
  const buffer = new Buffer("Lorem😄\nipsum😄\n");

  assertEquals(buffer.eol_starts, [6, 13]);
  assertEquals(buffer.eol_ends, [7, 14]);
});

Deno.test("parse \r\n", () => {
  const buffer = new Buffer("Lorem😄\r\nipsum😄\r\n");

  assertEquals(buffer.eol_starts, [6, 14]);
  assertEquals(buffer.eol_ends, [8, 16]);
});

Deno.test("parse \n and \r\n", () => {
  const buffer = new Buffer("Lorem😄\nipsum😄\r\n");

  assertEquals(buffer.eol_starts, [6, 13]);
  assertEquals(buffer.eol_ends, [7, 15]);
});
