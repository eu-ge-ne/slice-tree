import { assertEquals } from "@std/assert";

import { add_eols, type EOL } from "../src/eol.ts";

Deno.test("parse no newlines", () => {
  const eols: EOL[] = [];

  add_eols(eols, "Lorem ipsum");

  assertEquals(eols, []);
});

Deno.test("parse \n", () => {
  const eols: EOL[] = [];

  add_eols(eols, "Lorem😄\nipsum😄\n");

  assertEquals(eols, [
    { start: 6, end: 7 },
    { start: 13, end: 14 },
  ]);
});

Deno.test("parse \r\n", () => {
  const eols: EOL[] = [];

  add_eols(eols, "Lorem😄\r\nipsum😄\r\n");

  assertEquals(eols, [
    { start: 6, end: 8 },
    { start: 14, end: 16 },
  ]);
});

Deno.test("parse \n and \r\n", () => {
  const eols: EOL[] = [];

  add_eols(eols, "Lorem😄\nipsum😄\r\n");

  assertEquals(eols, [
    { start: 6, end: 7 },
    { start: 13, end: 15 },
  ]);
});
