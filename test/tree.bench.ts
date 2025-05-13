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

for (let power = 0; power < 3; power += 1) {
  const n = 10 ** power;

  Deno.bench(
    `Inserting sparsed x${n} into a SliceTree`,
    {
      group: `Inserting sparsed x${n}`,
      baseline: true,
    },
    (b) => {
      const text = createSliceTree();

      b.start();

      let pos = TEST_STRING_SIZE * 10;
      for (let i = 1; i <= n; i += 1) {
        text.write(pos, test_string());
        pos += TEST_STRING_SIZE * 10;
      }

      b.end();
    },
  );

  Deno.bench(
    `Inserting sparsed x${n} into a string`,
    {
      group: `Inserting sparsed x${n}`,
    },
    (b) => {
      let text = createString();

      b.start();

      let pos = TEST_STRING_SIZE * 10;
      for (let i = 1; i <= n; i += 1) {
        text = text.slice(0, pos) + test_string() + text.slice(pos);
        pos += TEST_STRING_SIZE * 10;
      }

      b.end();
    },
  );
}

for (let power = 0; power < 3; power += 1) {
  const n = 10 ** power;

  Deno.bench(
    `Removing sequential x${n} from a SliceTree`,
    {
      group: `Removing sequential x${n}`,
      baseline: true,
    },
    (b) => {
      const text = createSliceTree();

      b.start();

      let pos = Math.floor(text.count / 2);
      for (let i = 1; i <= n; i += 1) {
        text.erase(pos, 1);
        pos -= 1;
      }

      b.end();
    },
  );

  Deno.bench(
    `Removing sequential x${n} from a string`,
    {
      group: `Removing sequential x${n}`,
    },
    (b) => {
      let text = createString();

      b.start();

      let pos = Math.floor(text.length / 2);
      for (let i = 1; i <= n; i += 1) {
        text = text.slice(0, pos) + text.slice(pos + 1);
        pos -= 1;
      }

      b.end();
    },
  );
}

for (let power = 0; power < 3; power += 1) {
  const n = 10 ** power;

  Deno.bench(
    `Removing x${n} from a SliceTree`,
    {
      group: `Removing x${n}`,
      baseline: true,
    },
    (b) => {
      const text = createSliceTree();

      b.start();

      let pos = TEST_STRING_SIZE * 10;
      for (let i = 1; i <= n; i += 1) {
        text.erase(pos, TEST_STRING_SIZE);
        pos += TEST_STRING_SIZE * 10;
      }

      b.end();
    },
  );

  Deno.bench(
    `Removing x${n} from a string`,
    {
      group: `Removing x${n}`,
    },
    (b) => {
      let text = createString();

      b.start();

      let pos = TEST_STRING_SIZE * 10;
      for (let i = 1; i <= n; i += 1) {
        text = text.slice(0, pos) + text.slice(pos + TEST_STRING_SIZE);
        pos += TEST_STRING_SIZE * 10;
      }

      b.end();
    },
  );
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
