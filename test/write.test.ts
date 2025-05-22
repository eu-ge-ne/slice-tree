import { expect, test } from "vitest";

import { SliceTree } from "../src/tree.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

test("Write to the end of a text", () => {
  const text = new SliceTree();

  text.write(text.count, "Lorem");
  assert_iterator(text.read(0), "Lorem");
  expect(text.count).toBe(5);
  assert_tree(text);

  text.write(text.count, " ipsum");
  assert_iterator(text.read(0), "Lorem ipsum");
  expect(text.count).toBe(11);
  assert_tree(text);

  text.write(text.count, " dolor");
  assert_iterator(text.read(0), "Lorem ipsum dolor");
  expect(text.count).toBe(17);
  assert_tree(text);

  text.write(text.count, " sit");
  assert_iterator(text.read(0), "Lorem ipsum dolor sit");
  expect(text.count).toBe(21);
  assert_tree(text);

  text.write(text.count, " amet,");
  assert_iterator(text.read(0), "Lorem ipsum dolor sit amet,");
  expect(text.count).toBe(27);
  assert_tree(text);

  text.write(text.count, " consectetur");
  assert_iterator(text.read(0), "Lorem ipsum dolor sit amet, consectetur");
  expect(text.count).toBe(39);
  assert_tree(text);

  text.write(text.count, " adipiscing");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing",
  );
  expect(text.count).toBe(50);
  assert_tree(text);

  text.write(text.count, " elit,");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
  );
  expect(text.count).toBe(56);
  assert_tree(text);

  text.write(text.count, " sed");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed",
  );
  expect(text.count).toBe(60);
  assert_tree(text);

  text.write(text.count, " do");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
  );
  expect(text.count).toBe(63);
  assert_tree(text);

  text.write(text.count, " eiusmod");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
  );
  expect(text.count).toBe(71);
  assert_tree(text);

  text.write(text.count, " tempor");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
  );
  expect(text.count).toBe(78);
  assert_tree(text);

  text.write(text.count, " incididunt");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
  );
  expect(text.count).toBe(89);
  assert_tree(text);

  text.write(text.count, " ut");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
  );
  expect(text.count).toBe(92);
  assert_tree(text);

  text.write(text.count, " labore");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
  );
  expect(text.count).toBe(99);
  assert_tree(text);

  text.write(text.count, " et");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et",
  );
  expect(text.count).toBe(102);
  assert_tree(text);

  text.write(text.count, " dolore");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
  );
  expect(text.count).toBe(109);
  assert_tree(text);

  text.write(text.count, " magna");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
  );
  expect(text.count).toBe(115);
  assert_tree(text);

  text.write(text.count, " aliqua.");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(123);
  assert_tree(text);
});

test("Write to the beginning of a text", () => {
  const text = new SliceTree();

  text.write(0, " aliqua.");
  assert_iterator(text.read(0), " aliqua.");
  expect(text.count).toBe(8);
  assert_tree(text);

  text.write(0, " magna");
  assert_iterator(text.read(0), " magna aliqua.");
  expect(text.count).toBe(14);
  assert_tree(text);

  text.write(0, " dolore");
  assert_iterator(text.read(0), " dolore magna aliqua.");
  expect(text.count).toBe(21);
  assert_tree(text);

  text.write(0, " et");
  assert_iterator(text.read(0), " et dolore magna aliqua.");
  expect(text.count).toBe(24);
  assert_tree(text);

  text.write(0, " labore");
  assert_iterator(text.read(0), " labore et dolore magna aliqua.");
  expect(text.count).toBe(31);
  assert_tree(text);

  text.write(0, " ut");
  assert_iterator(text.read(0), " ut labore et dolore magna aliqua.");
  expect(text.count).toBe(34);
  assert_tree(text);

  text.write(0, " incididunt");
  assert_iterator(
    text.read(0),
    " incididunt ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(45);
  assert_tree(text);

  text.write(0, " tempor");
  assert_iterator(
    text.read(0),
    " tempor incididunt ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(52);
  assert_tree(text);

  text.write(0, " eiusmod");
  assert_iterator(
    text.read(0),
    " eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(60);
  assert_tree(text);

  text.write(0, " do");
  assert_iterator(
    text.read(0),
    " do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(63);
  assert_tree(text);

  text.write(0, " sed");
  assert_iterator(
    text.read(0),
    " sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(67);
  assert_tree(text);

  text.write(0, " elit,");
  assert_iterator(
    text.read(0),
    " elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(73);
  assert_tree(text);

  text.write(0, " adipiscing");
  assert_iterator(
    text.read(0),
    " adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(84);
  assert_tree(text);

  text.write(0, " consectetur");
  assert_iterator(
    text.read(0),
    " consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(96);
  assert_tree(text);

  text.write(0, " amet,");
  assert_iterator(
    text.read(0),
    " amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(102);
  assert_tree(text);

  text.write(0, " sit");
  assert_iterator(
    text.read(0),
    " sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(106);
  assert_tree(text);

  text.write(0, " dolor");
  assert_iterator(
    text.read(0),
    " dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(112);
  assert_tree(text);

  text.write(0, " ipsum");
  assert_iterator(
    text.read(0),
    " ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(118);
  assert_tree(text);

  text.write(0, "Lorem");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(123);
  assert_tree(text);
});

test("Write splitting nodes", () => {
  const text = new SliceTree();

  text.write(0, "Lorem aliqua.");
  assert_iterator(text.read(0), "Lorem aliqua.");
  expect(text.count).toBe(13);
  assert_tree(text);

  text.write(5, " ipsum magna");
  assert_iterator(text.read(0), "Lorem ipsum magna aliqua.");
  expect(text.count).toBe(25);
  assert_tree(text);

  text.write(11, " dolor dolore");
  assert_iterator(text.read(0), "Lorem ipsum dolor dolore magna aliqua.");
  expect(text.count).toBe(38);
  assert_tree(text);

  text.write(17, " sit et");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit et dolore magna aliqua.",
  );
  expect(text.count).toBe(45);
  assert_tree(text);

  text.write(21, " amet, labore");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(58);
  assert_tree(text);

  text.write(27, " consectetur ut");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(73);
  assert_tree(text);

  text.write(39, " adipiscing incididunt");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing incididunt ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(95);
  assert_tree(text);

  text.write(50, " elit, tempor");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, tempor incididunt ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(108);
  assert_tree(text);

  text.write(56, " sed eiusmod");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(120);
  assert_tree(text);

  text.write(60, " do");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  expect(text.count).toBe(123);
  assert_tree(text);
});

test("Write at the negative index", () => {
  const text = new SliceTree();

  text.write(0, "ipsum");
  assert_iterator(text.read(0), "ipsum");
  expect(text.count).toBe(5);
  assert_tree(text);

  text.write(-5, " ");
  assert_iterator(text.read(0), " ipsum");
  expect(text.count).toBe(6);
  assert_tree(text);

  text.write(-6, "Lorem");
  assert_iterator(text.read(0), "Lorem ipsum");
  expect(text.count).toBe(11);
  assert_tree(text);
});
