import { assertEquals } from "jsr:@std/assert";

import { SliceTree } from "../src/tree.ts";
import { assert_tree } from "./validation.ts";

function createSliceTree(): SliceTree {
  const text = new SliceTree();

  text.write(0, "Lorem");
  text.write(text.count, " ipsum");
  text.write(text.count, " dolor");
  text.write(text.count, " sit");
  text.write(text.count, " amet,");
  text.write(text.count, " consectetur");
  text.write(text.count, " adipiscing");
  text.write(text.count, " elit,");
  text.write(text.count, " sed");
  text.write(text.count, " do");
  text.write(text.count, " eiusmod");
  text.write(text.count, " tempor");
  text.write(text.count, " incididunt");
  text.write(text.count, " ut");
  text.write(text.count, " labore");
  text.write(text.count, " et");
  text.write(text.count, " dolore");
  text.write(text.count, " magna");
  text.write(text.count, " aliqua.");

  return text;
}

for (let n = 1; n <= 10; n += 1) {
  Deno.test(`Erase ${n} chars from head sequentially`, () => {
    const text = createSliceTree();

    let expected =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

    while (expected.length > 0) {
      assertEquals(text.read(0).toArray().join(""), expected);
      assertEquals(text.count, expected.length);
      assert_tree(text);

      text.erase(0, n);
      expected = expected.slice(n);
    }

    assertEquals(text.read(0).toArray().join(""), "");
    assertEquals(text.count, 0);
    assert_tree(text);
  });
}

for (let n = 1; n <= 10; n += 1) {
  Deno.test(`Erase ${n} chars from tail sequentially`, () => {
    const text = createSliceTree();

    let expected =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

    while (expected.length > 0) {
      assertEquals(text.read(0).toArray().join(""), expected);
      assertEquals(text.count, expected.length);
      assert_tree(text);

      text.erase(-n, n);
      expected = expected.slice(0, -n);
    }

    assertEquals(text.read(0).toArray().join(""), "");
    assertEquals(text.count, 0);
    assert_tree(text);
  });
}

for (let n = 1; n <= 10; n += 1) {
  Deno.test(`Erase ${n} chars from middle sequentially`, () => {
    const text = createSliceTree();

    let expected =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

    while (expected.length > 0) {
      assertEquals(text.read(0).toArray().join(""), expected);
      assertEquals(text.count, expected.length);
      assert_tree(text);

      const pos = Math.floor(text.count / 2);
      text.erase(pos, n);
      expected = expected.slice(0, pos) + expected.slice(pos + n);
    }

    assertEquals(text.read(0).toArray().join(""), "");
    assertEquals(text.count, 0);
    assert_tree(text);
  });
}

Deno.test("Erase causing splitting nodes", () => {
  const text = new SliceTree();

  text.write(
    0,
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );

  let expected =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  for (let n = 2; text.count > 0;) {
    const s = Math.floor(text.count / n);
    for (let i = n - 1; i >= 1; i -= 1) {
      assertEquals(text.read(0).toArray().join(""), expected);
      assertEquals(text.count, expected.length);
      assert_tree(text);

      text.erase(s * i, 2);
      expected = expected.slice(0, s * i) + expected.slice(s * i + 2);
    }
    n += 1;
  }

  assertEquals(text.read(0).toArray().join(""), "");
  assertEquals(text.count, 0);
  assert_tree(text);
});

/*
Deno.test("erase from 1 node", () => {
  const text = new SliceTree();

  text.write(0, "ABCD");
  text.erase(1, 2);

  assertEquals(text.count, 2);
  assertEquals(text.line_count, 1);
  assertEquals(text.read(0).toArray().join(""), "AD");
  assertEquals(text.line(0).toArray().join(""), "AD");

  assert_tree(text);
});

for (let n = 2; n <= 20; n += 1) {
  Deno.test(`erase from ${n} nodes (1)`, () => {
    const size = 10;

    function str(i: number): string {
      return i.toString().padStart(size, ".....     ");
    }

    const text = new SliceTree();

    for (let i = 0; i < n; i += 1) {
      text.write(text.count, str(i));
    }

    text.erase(size / 2, (n - 1) * size);

    const expected = str(0).slice(0, size / 2) + str(n - 1).slice(size / 2);

    assertEquals(text.read(0).toArray().join(""), expected);
    assertEquals(text.line(0).toArray().join(""), expected);
    assertEquals(text.count, 10);
    assertEquals(text.line_count, 1);

    assert_tree(text);
  });
}

for (let n = 2; n <= 20; n += 1) {
  Deno.test(`erase from ${n} nodes (2)`, () => {
    const size = 10;

    function str(i: number): string {
      return i.toString().padStart(size, ".....     ");
    }

    const text = new SliceTree();

    for (let i = 0; i < n; i += 1) {
      text.write(text.count, str(i));
    }

    for (let i = 0; i < (n - 1); i += 1) {
      const erase_pos = Math.floor((text.count - size) / 2);
      text.erase(erase_pos, size);
    }

    const expected = str(0).slice(0, size / 2) + str(n - 1).slice(size / 2);

    assertEquals(text.read(0).toArray().join(""), expected);
    assertEquals(text.line(0).toArray().join(""), expected);
    assertEquals(text.count, 10);
    assertEquals(text.line_count, 1);

    assert_tree(text);
  });
}
*/
