import { assertEquals } from "@std/assert";

import { new_buffer } from "../src/buffer.ts";
import { code_point_reader } from "../src/reader.ts";

Deno.test("parse no newlines", () => {
  const buf = new_buffer(code_point_reader, "Lorem ipsum");

  assertEquals(buf.eols_i0, []);
  assertEquals(buf.eols_i1, []);
});

Deno.test("parse \n", () => {
  const buf = new_buffer(code_point_reader, "Lorem😄\nipsum😄\n");

  assertEquals(buf.eols_i0, [6, 13]);
  assertEquals(buf.eols_i1, [7, 14]);
});

Deno.test("parse \r\n", () => {
  const buf = new_buffer(code_point_reader, "Lorem😄\r\nipsum😄\r\n");

  assertEquals(buf.eols_i0, [6, 14]);
  assertEquals(buf.eols_i1, [8, 16]);
});

Deno.test("parse \n and \r\n", () => {
  const buf = new_buffer(code_point_reader, "Lorem😄\nipsum😄\r\n");

  assertEquals(buf.eols_i0, [6, 13]);
  assertEquals(buf.eols_i1, [7, 15]);
});
