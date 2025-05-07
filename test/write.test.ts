import { assertEquals } from "jsr:@std/assert";

import { SliceTree } from "../src/tree.ts";
import { assert_generator, assert_tree } from "./assert.ts";

Deno.test("Write to the end of a text", () => {
  const text = new SliceTree();

  text.write(text.count, "Lorem");
  assert_generator(text.read(0), "Lorem");
  assertEquals(text.count, 5);
  assert_tree(text);

  text.write(text.count, " ipsum");
  assert_generator(text.read(0), "Lorem ipsum");
  assertEquals(text.count, 11);
  assert_tree(text);

  text.write(text.count, " dolor");
  assert_generator(text.read(0), "Lorem ipsum dolor");
  assertEquals(text.count, 17);
  assert_tree(text);

  text.write(text.count, " sit");
  assert_generator(text.read(0), "Lorem ipsum dolor sit");
  assertEquals(text.count, 21);
  assert_tree(text);

  text.write(text.count, " amet,");
  assert_generator(text.read(0), "Lorem ipsum dolor sit amet,");
  assertEquals(text.count, 27);
  assert_tree(text);

  text.write(text.count, " consectetur");
  assert_generator(text.read(0), "Lorem ipsum dolor sit amet, consectetur");
  assertEquals(text.count, 39);
  assert_tree(text);

  text.write(text.count, " adipiscing");
  assert_generator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing",
  );
  assertEquals(text.count, 50);
  assert_tree(text);

  text.write(text.count, " elit,");
  assert_generator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
  );
  assertEquals(text.count, 56);
  assert_tree(text);

  text.write(text.count, " sed");
  assert_generator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed",
  );
  assertEquals(text.count, 60);
  assert_tree(text);

  text.write(text.count, " do");
  assert_generator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
  );
  assertEquals(text.count, 63);
  assert_tree(text);

  text.write(text.count, " eiusmod");
  assert_generator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
  );
  assertEquals(text.count, 71);
  assert_tree(text);

  text.write(text.count, " tempor");
  assert_generator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
  );
  assertEquals(text.count, 78);
  assert_tree(text);

  text.write(text.count, " incididunt");
  assert_generator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
  );
  assertEquals(text.count, 89);
  assert_tree(text);

  text.write(text.count, " ut");
  assert_generator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",
  );
  assertEquals(text.count, 92);
  assert_tree(text);

  text.write(text.count, " labore");
  assert_generator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
  );
  assertEquals(text.count, 99);
  assert_tree(text);

  text.write(text.count, " et");
  assert_generator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et",
  );
  assertEquals(text.count, 102);
  assert_tree(text);

  text.write(text.count, " dolore");
  assert_generator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
  );
  assertEquals(text.count, 109);
  assert_tree(text);

  text.write(text.count, " magna");
  assert_generator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
  );
  assertEquals(text.count, 115);
  assert_tree(text);

  text.write(text.count, " aliqua.");
  assert_generator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 123);
  assert_tree(text);
});

Deno.test("Write to the beginning of a text", () => {
  const text = new SliceTree();

  text.write(0, " aliqua.");
  assert_generator(text.read(0), " aliqua.");
  assertEquals(text.count, 8);
  assert_tree(text);

  text.write(0, " magna");
  assert_generator(text.read(0), " magna aliqua.");
  assertEquals(text.count, 14);
  assert_tree(text);

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

  assert_generator(
    text.read(0),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );
  assertEquals(text.count, 123);
  assert_tree(text);
});
