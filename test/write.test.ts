import { assertEquals } from "@std/assert";

import { SliceTree } from "../src/mod.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

Deno.test("Write to the end of a text", () => {
  const text = SliceTree.units();

  text.write(text.count, "Lorem");
  assert_iterator(text.read(0), "Lorem");
  assertEquals(text.count, 5);
  assert_tree(text);

  text.write(text.count, " ipsum");
  assert_iterator(text.read(0), "Lorem ipsum");
  assertEquals(text.count, 11);
  assert_tree(text);

  text.write(text.count, " dolor");
  assert_iterator(text.read(0), "Lorem ipsum dolor");
  assertEquals(text.count, 17);
  assert_tree(text);

  text.write(text.count, " sit");
  assert_iterator(text.read(0), "Lorem ipsum dolor sit");
  assertEquals(text.count, 21);
  assert_tree(text);

  text.write(text.count, " amet,");
  assert_iterator(text.read(0), "Lorem ipsum dolor sit amet,");
  assertEquals(text.count, 27);
  assert_tree(text);

  text.write(text.count, " consectetur");
  assert_iterator(text.read(0), "Lorem ipsum dolor sit amet, consectetur");
  assertEquals(text.count, 39);
  assert_tree(text);

  text.write(text.count, " adipiscing");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing",
  );
  assertEquals(text.count, 50);
  assert_tree(text);

  text.write(text.count, " elit,");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
  );
  assertEquals(text.count, 56);
  assert_tree(text);

  text.write(text.count, " sed");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed",
  );
  assertEquals(text.count, 60);
  assert_tree(text);

  text.write(text.count, " do");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
  );
  assertEquals(text.count, 63);
  assert_tree(text);

  text.write(text.count, " eiusmod");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
  );
  assertEquals(text.count, 71);
  assert_tree(text);

  text.write(text.count, " tempor");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
  );
  assertEquals(text.count, 78);
  assert_tree(text);

  text.write(text.count, " incididunt");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
  );
  assertEquals(text.count, 89);
  assert_tree(text);

  text.write(text.count, " ut");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
  );
  assertEquals(text.count, 92);
  assert_tree(text);

  text.write(text.count, " labore");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
  );
  assertEquals(text.count, 99);
  assert_tree(text);

  text.write(text.count, " et");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et",
  );
  assertEquals(text.count, 102);
  assert_tree(text);

  text.write(text.count, " dolore");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
  );
  assertEquals(text.count, 109);
  assert_tree(text);

  text.write(text.count, " magna");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
  );
  assertEquals(text.count, 115);
  assert_tree(text);

  text.write(text.count, " aliqua.");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 123);
  assert_tree(text);
});

Deno.test("Write to the beginning of a text", () => {
  const text = SliceTree.units();

  text.write(0, " aliqua.");
  assert_iterator(text.read(0), " aliqua.");
  assertEquals(text.count, 8);
  assert_tree(text);

  text.write(0, " magna");
  assert_iterator(text.read(0), " magna aliqua.");
  assertEquals(text.count, 14);
  assert_tree(text);

  text.write(0, " dolore");
  assert_iterator(text.read(0), " dolore magna aliqua.");
  assertEquals(text.count, 21);
  assert_tree(text);

  text.write(0, " et");
  assert_iterator(text.read(0), " et dolore magna aliqua.");
  assertEquals(text.count, 24);
  assert_tree(text);

  text.write(0, " labore");
  assert_iterator(text.read(0), " labore et dolore magna aliqua.");
  assertEquals(text.count, 31);
  assert_tree(text);

  text.write(0, " ut");
  assert_iterator(text.read(0), " ut labore et dolore magna aliqua.");
  assertEquals(text.count, 34);
  assert_tree(text);

  text.write(0, " incididunt");
  assert_iterator(
    text.read(0),
    " incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 45);
  assert_tree(text);

  text.write(0, " tempor");
  assert_iterator(
    text.read(0),
    " tempor incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 52);
  assert_tree(text);

  text.write(0, " eiusmod");
  assert_iterator(
    text.read(0),
    " eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 60);
  assert_tree(text);

  text.write(0, " do");
  assert_iterator(
    text.read(0),
    " do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 63);
  assert_tree(text);

  text.write(0, " sed");
  assert_iterator(
    text.read(0),
    " sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 67);
  assert_tree(text);

  text.write(0, " elit,");
  assert_iterator(
    text.read(0),
    " elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 73);
  assert_tree(text);

  text.write(0, " adipiscing");
  assert_iterator(
    text.read(0),
    " adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 84);
  assert_tree(text);

  text.write(0, " consectetur");
  assert_iterator(
    text.read(0),
    " consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 96);
  assert_tree(text);

  text.write(0, " amet,");
  assert_iterator(
    text.read(0),
    " amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 102);
  assert_tree(text);

  text.write(0, " sit");
  assert_iterator(
    text.read(0),
    " sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 106);
  assert_tree(text);

  text.write(0, " dolor");
  assert_iterator(
    text.read(0),
    " dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 112);
  assert_tree(text);

  text.write(0, " ipsum");
  assert_iterator(
    text.read(0),
    " ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 118);
  assert_tree(text);

  text.write(0, "Lorem");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 123);
  assert_tree(text);
});

Deno.test("Write splitting nodes", () => {
  const text = SliceTree.units();

  text.write(0, "Lorem aliqua.");
  assert_iterator(text.read(0), "Lorem aliqua.");
  assertEquals(text.count, 13);
  assert_tree(text);

  text.write(5, " ipsum magna");
  assert_iterator(text.read(0), "Lorem ipsum magna aliqua.");
  assertEquals(text.count, 25);
  assert_tree(text);

  text.write(11, " dolor dolore");
  assert_iterator(text.read(0), "Lorem ipsum dolor dolore magna aliqua.");
  assertEquals(text.count, 38);
  assert_tree(text);

  text.write(17, " sit et");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit et dolore magna aliqua.",
  );
  assertEquals(text.count, 45);
  assert_tree(text);

  text.write(21, " amet, labore");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 58);
  assert_tree(text);

  text.write(27, " consectetur ut");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 73);
  assert_tree(text);

  text.write(39, " adipiscing incididunt");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 95);
  assert_tree(text);

  text.write(50, " elit, tempor");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, tempor incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 108);
  assert_tree(text);

  text.write(56, " sed eiusmod");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 120);
  assert_tree(text);

  text.write(60, " do");
  assert_iterator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 123);
  assert_tree(text);
});

Deno.test("Write at the negative index", () => {
  const text = SliceTree.units();

  text.write(0, "ipsum");
  assert_iterator(text.read(0), "ipsum");
  assertEquals(text.count, 5);
  assert_tree(text);

  text.write(-5, " ");
  assert_iterator(text.read(0), " ipsum");
  assertEquals(text.count, 6);
  assert_tree(text);

  text.write(-6, "Lorem");
  assert_iterator(text.read(0), "Lorem ipsum");
  assertEquals(text.count, 11);
  assert_tree(text);
});
