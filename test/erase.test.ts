import { expect, test } from "vitest";

import { SliceTree } from "../src/tree.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

const EXPECTED =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

function slice_tree(): SliceTree {
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

function test_erase_head(text: SliceTree, n: number): void {
  let expected = EXPECTED;

  while (expected.length > 0) {
    assert_iterator(text.read(0), expected);
    expect(text.count).toBe(expected.length);
    assert_tree(text);

    text.erase(0, n);
    expected = expected.slice(n);
  }

  assert_iterator(text.read(0), "");
  expect(text.count).toBe(0);
  assert_tree(text);
}

function test_erase_tail(text: SliceTree, n: number): void {
  let expected = EXPECTED;

  while (expected.length > 0) {
    assert_iterator(text.read(0), expected);
    expect(text.count).toBe(expected.length);
    assert_tree(text);

    text.erase(-n, n);
    expected = expected.slice(0, -n);
  }

  assert_iterator(text.read(0), "");
  expect(text.count).toBe(0);
  assert_tree(text);
}

function test_erase_middle(text: SliceTree, n: number): void {
  let expected = EXPECTED;

  while (expected.length > 0) {
    assert_iterator(text.read(0), expected);
    expect(text.count).toBe(expected.length);
    assert_tree(text);

    const pos = Math.floor(text.count / 2);
    text.erase(pos, n);
    expected = expected.slice(0, pos) + expected.slice(pos + n);
  }

  assert_iterator(text.read(0), "");
  expect(text.count).toBe(0);
  assert_tree(text);
}

function range(n: number): number[] {
  return Array(n)
    .fill(0)
    .map((_, i) => i + 1);
}

test.for(range(10))(`Erase %i chars from the beginning of a text`, (n) => {
  test_erase_head(slice_tree(), n);
});

test.for(range(10))(
  `Erase %i chars from the beginning of a text reversed`,
  (n) => {
    test_erase_head(slice_tree_reversed(), n);
  },
);

test.for(range(10))(`Erase %i chars from the end of a text`, (n) => {
  test_erase_tail(slice_tree(), n);
});

test.for(range(10))(`Erase %i chars from the end of a text reversed`, (n) => {
  test_erase_tail(slice_tree_reversed(), n);
});

test.for(range(10))(`Erase %i from the middle of a text`, (n) => {
  test_erase_middle(slice_tree(), n);
});

test.for(range(10))(`Erase %i from the middle of text reversed`, (n) => {
  test_erase_middle(slice_tree_reversed(), n);
});

test("Erase causing splitting nodes", () => {
  const text = new SliceTree(EXPECTED);

  let expected = EXPECTED;

  for (let n = 2; text.count > 0; ) {
    const s = Math.floor(text.count / n);
    for (let i = n - 1; i >= 1; i -= 1) {
      assert_iterator(text.read(0), expected);
      expect(text.count).toBe(expected.length);
      assert_tree(text);

      text.erase(s * i, 2);
      expected = expected.slice(0, s * i) + expected.slice(s * i + 2);
    }
    n += 1;
  }

  assert_iterator(text.read(0), "");
  expect(text.count).toBe(0);
  assert_tree(text);
});
