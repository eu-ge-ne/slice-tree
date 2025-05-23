import { SliceTree } from "../src/tree.ts";

const data = await Deno.readTextFile("tmp/bench-data.txt");

const TEST_STRING_SIZE = 20;

let counter = Number.MAX_SAFE_INTEGER;

function test_string(): string {
  return (counter--).toString().padStart(TEST_STRING_SIZE);
}

function createSliceTree(): SliceTree {
  const str = test_string();

  const text = new SliceTree();

  text.write(text.count, str);
  text.write(text.count, data);
  text.write(text.count, str);

  return text;
}

function createString(): string {
  const str = test_string();

  const text = str + data + str;

  return text;
}

const LINE_BREAKS_RE = /r?\n/gm;

function read_line(text: string, index: number): string {
  const matches = Array.from(text.matchAll(LINE_BREAKS_RE));

  const line_breaks = matches.map((x) => x.index + x[0].length);

  if (index === 0) {
    return text.slice(0, line_breaks[0]);
  } else {
    return text.slice(line_breaks[index - 1], line_breaks[index]);
  }
}

Deno.bench(
  "Accessing a line in a SliceTree",
  {
    group: "Accessing a line",
    baseline: true,
  },
  (b) => {
    const text = createSliceTree();

    b.start();

    for (let i = 0; i < 10; i += 1) {
      text.write(1, test_string());
      const _ = text.line(i).toArray().join("");
    }

    b.end();
  },
);

Deno.bench(
  "Accessing a line in a string",
  {
    group: "Accessing a line",
  },
  (b) => {
    let text = createString();

    b.start();

    for (let i = 0; i < 10; i += 1) {
      text = text.slice(0, 1) + test_string() + text.slice(1);
      const _ = read_line(text, i);
    }

    b.end();
  },
);
