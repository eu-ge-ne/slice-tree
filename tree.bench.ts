import { SliceTree } from "./tree.ts";

const data = await Deno.readTextFile("tmp/bench-data.txt");

let counter = Number.MAX_SAFE_INTEGER;

function unique_string(): string {
  return (counter--).toString();
}

const LINE_BREAKS_RE = /r?\n/gm;

function read_line(text: string, index: number): string {
  const matches = Array.from(text.matchAll(LINE_BREAKS_RE));

  const line_breaks = matches.map((x) => x.index + x[0].length);

  if (index === 0) {
    return text.substring(0, line_breaks[0]);
  } else {
    return text.substring(line_breaks[index - 1], line_breaks[index]);
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

Deno.bench(
  "Inserting x1 into a SliceTree",
  {
    group: "Inserting x1",
    baseline: true,
  },
  (b) => {
    const unique = unique_string();
    const text = new SliceTree();
    text.write(0, unique);
    text.write(text.count, data);

    b.start();

    text.write(1, unique);

    b.end();
  },
);

Deno.bench(
  "Inserting x1 into a string",
  {
    group: "Inserting x1",
  },
  (b) => {
    const unique = unique_string();
    let text = unique + data;

    b.start();

    text = text.substring(0, 1) + unique + text.substring(1);

    b.end();
  },
);

Deno.bench(
  "Inserting x10 into a SliceTree",
  {
    group: "Inserting x10",
    baseline: true,
  },
  (b) => {
    const unique = unique_string();
    const text = new SliceTree();
    text.write(0, unique);
    text.write(text.count, data);

    b.start();

    for (let i = 1; i <= 10; i += 1) {
      text.write(i * 100, unique);
    }

    b.end();
  },
);

Deno.bench(
  "Inserting x10 into a string",
  {
    group: "Inserting x10",
  },
  (b) => {
    const unique = unique_string();
    let text = unique + data;

    b.start();

    for (let i = 1; i <= 10; i += 1) {
      text = text.substring(0, i * 100) + unique + text.substring(i * 100);
    }

    b.end();
  },
);

Deno.bench(
  "Inserting x100 into a SliceTree",
  {
    group: "Inserting x100",
    baseline: true,
  },
  (b) => {
    const unique = unique_string();
    const text = new SliceTree();
    text.write(0, unique);
    text.write(text.count, data);

    b.start();

    for (let i = 1; i <= 100; i += 1) {
      text.write(i * 100, unique);
    }

    b.end();
  },
);

Deno.bench(
  "Inserting x100 into a string",
  {
    group: "Inserting x100",
  },
  (b) => {
    const unique = unique_string();
    let text = unique + data;

    b.start();

    for (let i = 1; i <= 100; i += 1) {
      text = text.substring(0, i * 100) + unique + text.substring(i * 100);
    }

    b.end();
  },
);

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

    text = text.substring(0, 1) + text.substring(2);

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

    for (let i = 1; i <= 10; i += 1) {
      text.erase(i * 100, 1);
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

    for (let i = 1; i <= 10; i += 1) {
      text = text.substring(0, i * 100) + text.substring((i * 100) + 1);
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

    for (let i = 1; i <= 100; i += 1) {
      text.erase(i * 100, 1);
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
      text = text.substring(0, i * 100) + text.substring((i * 100) + 1);
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
      text = text.substring(0, 1) + unique + text.substring(1);
      const _ = read_line(text, i);
    }

    b.end();
  },
);
