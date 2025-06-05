import { assertEquals } from "@std/assert";

import { new_buffer } from "../src/buffer.ts";
import { code_point_reader, code_unit_reader } from "../src/reader.ts";

Deno.test("0 newlines with code_unit_reader", () => {
  const buf = new_buffer(code_unit_reader, "Lorem ipsum");

  assertEquals(buf.eol_starts, []);
  assertEquals(buf.eol_ends, []);
});

Deno.test("0 newlines with code_point_reader", () => {
  const buf = new_buffer(code_point_reader, "Lorem😄ipsum");

  assertEquals(buf.eol_starts, []);
  assertEquals(buf.eol_ends, []);
});

Deno.test("\n with code_unit_reader", () => {
  const buf = new_buffer(code_unit_reader, "Lorem \nipsum \n");

  assertEquals(buf.eol_starts, [6, 13]);
  assertEquals(buf.eol_ends, [7, 14]);
});

Deno.test("\n with code_point_reader", () => {
  const buf = new_buffer(code_point_reader, "Lorem😄\nipsum😄\n");

  assertEquals(buf.eol_starts, [6, 13]);
  assertEquals(buf.eol_ends, [7, 14]);
});

Deno.test("\r\n with code_unit_reader", () => {
  const buf = new_buffer(code_unit_reader, "Lorem \r\nipsum \r\n");

  assertEquals(buf.eol_starts, [6, 14]);
  assertEquals(buf.eol_ends, [8, 16]);
});

Deno.test("\r\n with code_point_reader", () => {
  const buf = new_buffer(code_point_reader, "Lorem😄\r\nipsum😄\r\n");

  assertEquals(buf.eol_starts, [6, 14]);
  assertEquals(buf.eol_ends, [8, 16]);
});

Deno.test("\n and \r\n with code_unit_reader", () => {
  const buf = new_buffer(code_unit_reader, "Lorem \nipsum \r\n");

  assertEquals(buf.eol_starts, [6, 13]);
  assertEquals(buf.eol_ends, [7, 15]);
});

Deno.test("\n and \r\n with code_point_reader", () => {
  const buf = new_buffer(code_point_reader, "Lorem😄\nipsum😄\r\n");

  assertEquals(buf.eol_starts, [6, 13]);
  assertEquals(buf.eol_ends, [7, 15]);
});
