import { SliceTree } from "./tree.ts";

const data = await Deno.readTextFile("tmp/bench-data.txt");

let counter = Number.MAX_SAFE_INTEGER;

function unique_string(): string {
  return (counter--).toString().padStart(20);
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
  "Creating a SliceTree",
  {
    group: "Creating",
    baseline: true,
  },
  () => {
    new SliceTree().write(0, unique_string());
  },
);

Deno.bench(
  "Creating a string",
  {
    group: "Creating",
  },
  () => {
    unique_string();
  },
);

for (let power = 0; power < 3; power += 1) {
  const n = 10 ** power;

  Deno.bench(
    `Inserting x${n} into a SliceTree`,
    {
      group: `Inserting x${n}`,
      baseline: true,
    },
    (b) => {
      const unique = unique_string();
      const text = new SliceTree();
      text.write(0, unique);
      text.write(text.count, data);

      b.start();

      let pos = 1;
      for (let i = 1; i <= n; i += 1) {
        text.write(pos, unique);
        pos += unique.length * 2;
      }

      b.end();
    },
  );

  Deno.bench(
    `Inserting x${n} into a string`,
    {
      group: `Inserting x${n}`,
    },
    (b) => {
      const unique = unique_string();
      let text = unique + data;

      b.start();

      let pos = 1;
      for (let i = 1; i <= n; i += 1) {
        text = text.slice(0, pos) + unique + text.slice(pos);
        pos += unique.length * 2;
      }

      b.end();
    },
  );
}

Deno.bench(
  "Removing x1 from a SliceTree",
  {
    group: "Removing x1",
    baseline: true,
  },
  (b) => {
    const unique = unique_string();
    const text = new SliceTree();
    text.write(0, unique);
    text.write(text.count, data);

    b.start();

    text.erase(1, 1);

    b.end();
  },
);

Deno.bench(
  "Removing x1 from a string",
  {
    group: "Removing x1",
  },
  (b) => {
    const unique = unique_string();
    let text = unique + data;

    b.start();

    text = text.slice(0, 1) + text.slice(2);

    b.end();
  },
);

Deno.bench(
  "Removing x10 from a SliceTree",
  {
    group: "Removing x10",
    baseline: true,
  },
  (b) => {
    const unique = unique_string();
    const text = new SliceTree();
    text.write(0, unique);
    text.write(text.count, data);

    b.start();

    let pos = 1;
    for (let i = 1; i <= 10; i += 1) {
      text.erase(pos, 1);
      pos += 1;
    }

    b.end();
  },
);

Deno.bench(
  "Removing x10 from a string",
  {
    group: "Removing x10",
  },
  (b) => {
    const unique = unique_string();
    let text = unique + data;

    b.start();

    let pos = 1;
    for (let i = 1; i <= 10; i += 1) {
      text = text.slice(0, pos) + text.slice(pos + 1);
      pos += 1;
    }

    b.end();
  },
);

Deno.bench(
  "Removing x100 from a SliceTree",
  {
    group: "Removing x100",
    baseline: true,
  },
  (b) => {
    const unique = unique_string();
    const text = new SliceTree();
    text.write(0, unique);
    text.write(text.count, data);

    b.start();

    let pos = 1;
    for (let i = 1; i <= 100; i += 1) {
      text.erase(pos, 1);
      pos += 1;
    }

    b.end();
  },
);

Deno.bench(
  "Removing x100 from a string",
  {
    group: "Removing x100",
  },
  (b) => {
    const unique = unique_string();
    let text = unique + data;

    b.start();

    for (let i = 1; i <= 100; i += 1) {
      text = text.slice(0, i * 100) + text.slice((i * 100) + 1);
    }

    b.end();
  },
);

Deno.bench(
  "Accessing a line in a SliceTree",
  {
    group: "Accessing a line",
    baseline: true,
  },
  (b) => {
    const unique = unique_string();
    const text = new SliceTree();
    text.write(0, unique);
    text.write(text.count, data);

    b.start();

    for (let i = 0; i < 10; i += 1) {
      text.write(1, unique);
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
    const unique = unique_string();
    let text = unique + data;

    b.start();

    for (let i = 0; i < 10; i += 1) {
      text = text.slice(0, 1) + unique + text.slice(1);
      const _ = read_line(text, i);
    }

    b.end();
  },
);
