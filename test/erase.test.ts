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

  for (let n = 2; text.count > 0;) {
    const s = Math.floor(text.count / n);
    for (let i = n - 1; i >= 1; i -= 1) {
      text.erase(s * i, 2);
    }
    n += 1;
  }

  assertEquals(text.read(0).toArray().join(""), "");
  assertEquals(text.count, 0);
  assert_tree(text);
});
