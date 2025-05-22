import { expect, test } from "vitest";

import { SliceTree } from "../src/tree.ts";
import { assert_tree } from "./assert.ts";

test("Line range at valid index", () => {
  const text = new SliceTree(
    "Lorem\nipsum\ndolor\nsit\namet,\nconsectetur\nadipiscing\nelit,\nsed\ndo\neiusmod\ntempor\nincididunt\nut\nlabore\net\ndolore\nmagna\naliqua.",
  );

  expect(text.line_range(0)).toEqual([0, 6]);
  expect(text.line_range(1)).toEqual([6, 12]);
  expect(text.line_range(2)).toEqual([12, 18]);
  expect(text.line_range(3)).toEqual([18, 22]);
  expect(text.line_range(4)).toEqual([22, 28]);
  expect(text.line_range(5)).toEqual([28, 40]);
  expect(text.line_range(6)).toEqual([40, 51]);
  expect(text.line_range(7)).toEqual([51, 57]);
  expect(text.line_range(8)).toEqual([57, 61]);
  expect(text.line_range(9)).toEqual([61, 64]);
  expect(text.line_range(10)).toEqual([64, 72]);
  expect(text.line_range(11)).toEqual([72, 79]);
  expect(text.line_range(12)).toEqual([79, 90]);
  expect(text.line_range(13)).toEqual([90, 93]);
  expect(text.line_range(14)).toEqual([93, 100]);
  expect(text.line_range(15)).toEqual([100, 103]);
  expect(text.line_range(16)).toEqual([103, 110]);
  expect(text.line_range(17)).toEqual([110, 116]);
  expect(text.line_range(18)).toEqual([116, undefined]);

  assert_tree(text);
});

test("Line range at index >= line_count", () => {
  const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

  expect(text.line_range(4)).toEqual([22, undefined]);
  expect(text.line_range(5)).toBe(undefined);
  expect(text.line_range(6)).toBe(undefined);

  assert_tree(text);
});

test("Line range at index < 0", () => {
  const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

  expect(text.line_range(0)).toEqual([0, 6]);
  expect(text.line_range(-1)).toEqual([22, undefined]);
  expect(text.line_range(-2)).toEqual([18, 22]);

  assert_tree(text);
});
