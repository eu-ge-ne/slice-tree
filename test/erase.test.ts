import { assertEquals } from "jsr:@std/assert";

import { SliceTree } from "../src/tree.ts";
import { assert_tree } from "./validation.ts";

const EXPECTED =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

function slice_tree_sequential(): SliceTree {
  const text = new SliceTree();

  text.write(text.count, "Lorem");
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

function slice_tree_reversed(): SliceTree {
  const text = new SliceTree();

  text.write(0, " aliqua.");
  text.write(0, " magna");
  text.write(0, " dolore");
  text.write(0, " et");
  text.write(0, " labore");
  text.write(0, " ut");
  text.write(0, " incididunt");
  text.write(0, " tempor");
  text.write(0, " eiusmod");
  text.write(0, " do");
  text.write(0, " sed");
  text.write(0, " elit,");
  text.write(0, " adipiscing");
  text.write(0, " consectetur");
  text.write(0, " amet,");
  text.write(0, " sit");
  text.write(0, " dolor");
  text.write(0, " ipsum");
  text.write(0, "Lorem");

  return text;
}

for (let n = 1; n <= 10; n += 1) {
  Deno.test(`Erase ${n} chars from the head of sequential slice tree`, () => {
    const text = slice_tree_sequential();

    let expected = EXPECTED;

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
  Deno.test(`Erase ${n} chars from the head of reversed slice tree`, () => {
    const text = slice_tree_reversed();

    let expected = EXPECTED;

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
  Deno.test(`Erase ${n} chars from the tail of sequential slice tree`, () => {
    const text = slice_tree_sequential();

    let expected = EXPECTED;

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
  Deno.test(`Erase ${n} chars from the tail of reversed slice tree`, () => {
    const text = slice_tree_reversed();

    let expected = EXPECTED;

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
  Deno.test(`Erase ${n} chars from the middle of sequential slice tree`, () => {
    const text = slice_tree_sequential();

    let expected = EXPECTED;

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

for (let n = 1; n <= 10; n += 1) {
  Deno.test(`Erase ${n} chars from the middle of reversed slice tree`, () => {
    const text = slice_tree_reversed();

    let expected = EXPECTED;

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
  text.write(0, EXPECTED);

  let expected = EXPECTED;

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
