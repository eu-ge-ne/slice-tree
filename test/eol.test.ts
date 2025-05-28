import { assertEquals } from "@std/assert";

import { create_eols } from "../src/eol.ts";

Deno.test("parse no newlines", () => {
  const eols = create_eols("Hello world").toArray();

  assertEquals(eols, []);
});

Deno.test("parse \n", () => {
  const eols = create_eols("Hello\nworld\n").toArray();

  assertEquals(eols, [
    {
      start: 5,
      end: 6,
    },
    {
      start: 11,
      end: 12,
    },
  ]);
});

Deno.test("parse \r\n", () => {
  const eols = create_eols("Hello\r\nworld\r\n").toArray();

  assertEquals(eols, [
    {
      start: 5,
      end: 7,
    },
    {
      start: 12,
      end: 14,
    },
  ]);
});

Deno.test("parse \n and \r\n", () => {
  const eols = create_eols("Hello\nworld\r\n").toArray();

  assertEquals(eols, [
    {
      start: 5,
      end: 6,
    },
    {
      start: 11,
      end: 13,
    },
  ]);
});
