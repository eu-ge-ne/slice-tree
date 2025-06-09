import { assertEquals } from "@std/assert";

import { assert_iterator } from "./assert.ts";
import { GraphemeBufferFactory } from "../src/grapheme.ts";
import { PointBufferFactory } from "../src/point.ts";
import { UnitBufferFactory } from "../src/unit.ts";

Deno.test("Read units", () => {
  const buf = new UnitBufferFactory().create("Lorem ipsum");

  assert_iterator(buf.read(6, 3), "ips");
});

Deno.test("Read points", () => {
  const buf = new PointBufferFactory(3).create("Lorem😄ipsum");

  assert_iterator(buf.read(6, 3), "ips");
});

Deno.test("Read graphemes", () => {
  const buf = new GraphemeBufferFactory(3).create("Lorem🤦ipsum");

  assert_iterator(buf.read(6, 3), "ips");
});

Deno.test("0 newlines as units", () => {
  const buf = new UnitBufferFactory().create("Lorem ipsum");

  assertEquals(buf.eol_starts, []);
  assertEquals(buf.eol_ends, []);
});

Deno.test("0 newlines as points", () => {
  const buf = new PointBufferFactory(3).create("Lorem😄ipsum");

  assertEquals(buf.eol_starts, []);
  assertEquals(buf.eol_ends, []);
});

Deno.test("0 newlines as graphemes", () => {
  const buf = new GraphemeBufferFactory(3).create("Lorem🤦ipsum");

  assertEquals(buf.eol_starts, []);
  assertEquals(buf.eol_ends, []);
});

Deno.test("\n as units", () => {
  const buf = new UnitBufferFactory().create("Lorem \nipsum \n");

  assertEquals(buf.eol_starts, [6, 13]);
  assertEquals(buf.eol_ends, [7, 14]);
});

Deno.test("\n as points", () => {
  const buf = new PointBufferFactory(3).create("Lorem😄\nipsum😄\n");

  assertEquals(buf.eol_starts, [6, 13]);
  assertEquals(buf.eol_ends, [7, 14]);
});

Deno.test("\n as graphemes", () => {
  const buf = new GraphemeBufferFactory(3).create("Lorem🤦\nipsum🤦\n");

  assertEquals(buf.eol_starts, [6, 13]);
  assertEquals(buf.eol_ends, [7, 14]);
});

Deno.test("\r\n as units", () => {
  const buf = new UnitBufferFactory().create("Lorem \r\nipsum \r\n");

  assertEquals(buf.eol_starts, [6, 14]);
  assertEquals(buf.eol_ends, [8, 16]);
});

Deno.test("\r\n as points", () => {
  const buf = new PointBufferFactory(3).create("Lorem😄\r\nipsum😄\r\n");

  assertEquals(buf.eol_starts, [6, 14]);
  assertEquals(buf.eol_ends, [8, 16]);
});

Deno.test("\r\n as graphemes", () => {
  const buf = new GraphemeBufferFactory(3).create("Lorem🤦\r\nipsum🤦\r\n");

  assertEquals(buf.eol_starts, [6, 13]);
  assertEquals(buf.eol_ends, [7, 14]);
});

Deno.test("\n and \r\n as units", () => {
  const buf = new UnitBufferFactory().create("Lorem \nipsum \r\n");

  assertEquals(buf.eol_starts, [6, 13]);
  assertEquals(buf.eol_ends, [7, 15]);
});

Deno.test("\n and \r\n as points", () => {
  const buf = new PointBufferFactory(3).create("Lorem😄\nipsum😄\r\n");

  assertEquals(buf.eol_starts, [6, 13]);
  assertEquals(buf.eol_ends, [7, 15]);
});

Deno.test("\n and \r\n as graphemes", () => {
  const buf = new GraphemeBufferFactory(3).create("Lorem🤦\nipsum🤦\r\n");

  assertEquals(buf.eol_starts, [6, 13]);
  assertEquals(buf.eol_ends, [7, 14]);
});
