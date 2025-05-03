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
  "Inserting 1 time into a SliceTree",
  {
    group: "Inserting 1 time",
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
  "Inserting 1 time into a string",
  {
    group: "Inserting 1 time",
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
  "Inserting 10 times into a SliceTree",
  {
    group: "Inserting 10 times",
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
  "Inserting 10 times into a string",
  {
    group: "Inserting 10 times",
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
  "Inserting 100 times into a SliceTree",
  {
    group: "Inserting 100 times",
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
  "Inserting 100 times into a string",
  {
    group: "Inserting 100 times",
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

// TODO

Deno.bench(
  "Removing 1 time from a SliceTree",
  {
    group: "Removing 1 time",
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
  "Removing 1 time from a string",
  {
    group: "Removing 1 time",
  },
  (b) => {
    const unique = unique_string();
    let text = unique + data;

    b.start();

    text = text.substring(0, 1) + text.substring(2);

    b.end();
  },
);

/*
Deno.bench(
  "Removing 10 chars from a SliceTree",
  {
    group: "Removing 10 chars",
    baseline: true,
  },
  (b) => {
    const char = random_string();
    const text = new SliceTree();
    text.write(0, char);
    text.write(1, data);

    b.start();

    for (let i = 1; i <= 10; i += 1) {
      text.erase(i * 10, 1);
    }

    b.end();
  },
);

Deno.bench(
  "Removing 10 chars from a string",
  {
    group: "Removing 10 chars",
  },
  (b) => {
    const char = random_string();
    let text = char + data;

    b.start();

    for (let i = 1; i <= 10; i += 1) {
      text = text.substring(0, i * 10) + text.substring((i * 10) + 1);
    }

    b.end();
  },
);

Deno.bench(
  "Removing 100 chars from a SliceTree",
  {
    group: "Removing 100 chars",
    baseline: true,
  },
  (b) => {
    const char = random_string();
    const text = new SliceTree();
    text.write(0, char);
    text.write(1, data);

    b.start();

    for (let i = 1; i <= 100; i += 1) {
      text.erase(i * 10, 1);
    }

    b.end();
  },
);

Deno.bench(
  "Removing 100 chars from a string",
  {
    group: "Removing 100 chars",
  },
  (b) => {
    const char = random_string();
    let text = char + data;

    b.start();

    for (let i = 1; i <= 100; i += 1) {
      text = text.substring(0, i * 10) + text.substring((i * 10) + 1);
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
    const char = random_string();
    const text = new SliceTree();
    text.write(0, char);
    text.write(1, data);

    b.start();

    for (let i = 0; i < 10; i += 1) {
      text.write(1, char);
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
    const char = random_string();
    let text = char + data;

    b.start();

    for (let i = 0; i < 10; i += 1) {
      text = text.substring(0, 1) + char + text.substring(1);
      const _ = read_line(text, i);
    }

    b.end();
  },
);
*/
