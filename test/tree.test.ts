import { assertEquals, assertInstanceOf } from "jsr:@std/assert";

import { SliceTree } from "../src/tree.ts";
import { assert_tree } from "./validation.ts";

Deno.test("count", () => {
  const text = new SliceTree();

  assertEquals(text.count, 0);
});

Deno.test("line_count", () => {
  const text = new SliceTree();

  assertEquals(text.line_count, 0);
});

Deno.test("read", () => {
  const text = new SliceTree();

  assertInstanceOf(text.read(0), Iterator);
  assertInstanceOf(text.read(0, 1), Iterator);
});

Deno.test("line", () => {
  const text = new SliceTree();

  assertInstanceOf(text.line(0), Iterator);
});

Deno.test("write", () => {
  const text = new SliceTree();

  text.write(0, "text");
});

Deno.test("erase", () => {
  const text = new SliceTree();

  text.erase(0, 1);
});

Deno.test("Empty tree is a valid red-black tree", () => {
  const text = new SliceTree();

  assert_tree(text);
});

Deno.test("Empty tree contains 0 characters", () => {
  const text = new SliceTree();

  assertEquals(text.count, 0);
});

Deno.test("Empty tree contains 0 lines", () => {
  const text = new SliceTree();

  assertEquals(text.line_count, 0);
});

Deno.test("Empty tree contains ''", () => {
  const text = new SliceTree();

  assertEquals(text.read(0).toArray().join(""), "");
});

Deno.test("write adds content", () => {
  const text = new SliceTree();

  text.write(0, "Lorem ipsum");

  assertEquals(text.count, 11);
  assertEquals(text.line_count, 1);
  assertEquals(text.read(0).toArray().join(""), "Lorem ipsum");
  assertEquals(text.line(0).toArray().join(""), "Lorem ipsum");

  assert_tree(text);
});

Deno.test("write adds new lines", () => {
  const text = new SliceTree();

  text.write(0, "Lorem ipsum");
  text.write(11, "\ndolor sit amet");

  assertEquals(text.count, 26);
  assertEquals(text.line_count, 2);
  assertEquals(text.read(0).toArray().join(""), "Lorem ipsum\ndolor sit amet");
  assertEquals(text.line(0).toArray().join(""), "Lorem ipsum\n");
  assertEquals(text.line(1).toArray().join(""), "dolor sit amet");

  assert_tree(text);
});

Deno.test("Random write produces valid red-black tree", () => {
  const text = new SliceTree();

  text.write(0, "Lorem");
  text.write(5, " aliqua.");
  text.write(5, " do");
  text.write(8, " ut");
  text.write(5, " consectetur");
  text.write(20, " tempor");
  text.write(5, " dolor");
  text.write(23, " elit,");
  text.write(42, " et");
  text.write(29, " sed");
  text.write(11, " amet,");
  text.write(55, " magna");
  text.write(29, " adipiscing");
  text.write(63, " labore");
  text.write(5, " ipsum");
  text.write(66, " incididunt");
  text.write(59, " eiusmod");
  text.write(98, " dolore");
  text.write(17, " sit");

  assertEquals(text.count, 123);
  assertEquals(
    text.read(0).toArray().join(""),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );

  assert_tree(text);
});

Deno.test("write causing splitting nodes produces valid red-black tree", () => {
  const text = new SliceTree();

  text.write(0, "Lorem aliqua.");
  text.write(5, " ipsum magna");
  text.write(11, " dolor dolore");
  text.write(17, " sit et");
  text.write(21, " amet, labore");
  text.write(27, " consectetur ut");
  text.write(39, " adipiscing incididunt");
  text.write(50, " elit, tempor");
  text.write(56, " sed eiusmod");
  text.write(60, " do");

  assertEquals(text.count, 123);
  assertEquals(
    text.read(0).toArray().join(""),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );

  assert_tree(text);
});

Deno.test("Sequential write produces valid red-black tree", () => {
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

  assertEquals(text.count, 123);
  assertEquals(
    text.read(0).toArray().join(""),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );

  assert_tree(text);
});

Deno.test("Reverse sequential write produces valid red-black tree", () => {
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

  assertEquals(text.count, 123);
  assertEquals(
    text.read(0).toArray().join(""),
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  );

  assert_tree(text);
});

Deno.test("Squential write produces expect number of lines", () => {
  const text = new SliceTree();

  for (let i = 0; i < 10; i += 1) {
    text.write(text.count, `${i}\n`);
  }

  assertEquals(text.count, 20);
  assertEquals(text.line_count, 11);
  assertEquals(
    text.read(0).toArray().join(""),
    "0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n",
  );
  assertEquals(text.line(0).toArray().join(""), "0\n");
  assertEquals(text.line(1).toArray().join(""), "1\n");
  assertEquals(text.line(2).toArray().join(""), "2\n");
  assertEquals(text.line(3).toArray().join(""), "3\n");
  assertEquals(text.line(4).toArray().join(""), "4\n");
  assertEquals(text.line(5).toArray().join(""), "5\n");
  assertEquals(text.line(6).toArray().join(""), "6\n");
  assertEquals(text.line(7).toArray().join(""), "7\n");
  assertEquals(text.line(8).toArray().join(""), "8\n");
  assertEquals(text.line(9).toArray().join(""), "9\n");
  assertEquals(text.line(10).toArray().join(""), "");

  assert_tree(text);
});

Deno.test("erase removes content", () => {
  const text = new SliceTree();

  text.write(0, "Lorem ipsum");
  text.erase(5, 6);

  assertEquals(text.count, 5);
  assertEquals(text.line_count, 1);
  assertEquals(text.read(0).toArray().join(""), "Lorem");
  assertEquals(text.line(0).toArray().join(""), "Lorem");

  assert_tree(text);
});

Deno.test("erase removes lines", () => {
  const text = new SliceTree();

  text.write(0, "Lorem ipsum\ndolor sit amet");
  text.erase(11, 15);

  assertEquals(text.count, 11);
  assertEquals(text.line_count, 1);
  assertEquals(text.read(0).toArray().join(""), "Lorem ipsum");
  assertEquals(text.line(0).toArray().join(""), "Lorem ipsum");

  assert_tree(text);
});

Deno.test("erase all leaves empty content", () => {
  const text = new SliceTree();

  text.write(0, "Lorem ipsum\ndolor sit amet");
  text.erase(0, 26);

  assertEquals(text.count, 0);
  assertEquals(text.line_count, 0);
  assertEquals(text.read(0).toArray().join(""), "");
  assertEquals(text.line(0).toArray().join(""), "");

  assert_tree(text);
});

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

Deno.test("erase causing splitting nodes produces valid red-black tree", () => {
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

Deno.test("line returns empty content for invalid index provided", () => {
  const text = new SliceTree();

  text.write(0, "Lorem ipsum\ndolor sit amet");

  assertEquals(text.line(-1).toArray().join(""), "");
  assertEquals(text.line(2).toArray().join(""), "");

  assert_tree(text);
});
