import { SliceTree } from "../src/tree.ts";
import { assert_iterator, assert_tree } from "./assert.ts";

Deno.test("Line at valid index", () => {
  const text = new SliceTree();

  text.write(0, "Lorem\naliqua.");
  text.write(6, "ipsum\nmagna\n");
  text.write(12, "dolor\ndolore\n");
  text.write(18, "sit\net\n");
  text.write(22, "amet,\nlabore\n");
  text.write(28, "consectetur\nut\n");
  text.write(40, "adipiscing\nincididunt\n");
  text.write(51, "elit,\ntempor\n");
  text.write(57, "sed\neiusmod\n");
  text.write(61, "do\n");

  assert_iterator(
    text.read_from_line(0),
    "Lorem\nipsum\ndolor\nsit\namet,\nconsectetur\nadipiscing\nelit,\nsed\ndo\neiusmod\ntempor\nincididunt\nut\nlabore\net\ndolore\nmagna\naliqua.",
  );
  assert_iterator(
    text.read_from_line(1),
    "ipsum\ndolor\nsit\namet,\nconsectetur\nadipiscing\nelit,\nsed\ndo\neiusmod\ntempor\nincididunt\nut\nlabore\net\ndolore\nmagna\naliqua.",
  );
  assert_iterator(
    text.read_from_line(2),
    "dolor\nsit\namet,\nconsectetur\nadipiscing\nelit,\nsed\ndo\neiusmod\ntempor\nincididunt\nut\nlabore\net\ndolore\nmagna\naliqua.",
  );
  assert_iterator(
    text.read_from_line(3),
    "sit\namet,\nconsectetur\nadipiscing\nelit,\nsed\ndo\neiusmod\ntempor\nincididunt\nut\nlabore\net\ndolore\nmagna\naliqua.",
  );
  assert_iterator(
    text.read_from_line(4),
    "amet,\nconsectetur\nadipiscing\nelit,\nsed\ndo\neiusmod\ntempor\nincididunt\nut\nlabore\net\ndolore\nmagna\naliqua.",
  );
  assert_iterator(
    text.read_from_line(5),
    "consectetur\nadipiscing\nelit,\nsed\ndo\neiusmod\ntempor\nincididunt\nut\nlabore\net\ndolore\nmagna\naliqua.",
  );
  assert_iterator(
    text.read_from_line(6),
    "adipiscing\nelit,\nsed\ndo\neiusmod\ntempor\nincididunt\nut\nlabore\net\ndolore\nmagna\naliqua.",
  );
  assert_iterator(
    text.read_from_line(7),
    "elit,\nsed\ndo\neiusmod\ntempor\nincididunt\nut\nlabore\net\ndolore\nmagna\naliqua.",
  );
  assert_iterator(
    text.read_from_line(8),
    "sed\ndo\neiusmod\ntempor\nincididunt\nut\nlabore\net\ndolore\nmagna\naliqua.",
  );
  assert_iterator(
    text.read_from_line(9),
    "do\neiusmod\ntempor\nincididunt\nut\nlabore\net\ndolore\nmagna\naliqua.",
  );
  assert_iterator(
    text.read_from_line(10),
    "eiusmod\ntempor\nincididunt\nut\nlabore\net\ndolore\nmagna\naliqua.",
  );
  assert_iterator(
    text.read_from_line(11),
    "tempor\nincididunt\nut\nlabore\net\ndolore\nmagna\naliqua.",
  );
  assert_iterator(
    text.read_from_line(12),
    "incididunt\nut\nlabore\net\ndolore\nmagna\naliqua.",
  );
  assert_iterator(
    text.read_from_line(13),
    "ut\nlabore\net\ndolore\nmagna\naliqua.",
  );
  assert_iterator(
    text.read_from_line(14),
    "labore\net\ndolore\nmagna\naliqua.",
  );
  assert_iterator(text.read_from_line(15), "et\ndolore\nmagna\naliqua.");
  assert_iterator(text.read_from_line(16), "dolore\nmagna\naliqua.");
  assert_iterator(text.read_from_line(17), "magna\naliqua.");
  assert_iterator(text.read_from_line(18), "aliqua.");

  assert_tree(text);
});

Deno.test("Line at index >= line_count", () => {
  const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

  assert_iterator(text.read_from_line(4), "amet");
  assert_iterator(text.read_from_line(5), "");
  assert_iterator(text.read_from_line(6), "");

  assert_tree(text);
});

Deno.test("Line at index < 0", () => {
  const text = new SliceTree("Lorem\nipsum\ndolor\nsit\namet");

  assert_iterator(text.read_from_line(0), "Lorem\nipsum\ndolor\nsit\namet");
  assert_iterator(text.read_from_line(-1), "amet");
  assert_iterator(text.read_from_line(-2), "sit\namet");

  assert_tree(text);
});
