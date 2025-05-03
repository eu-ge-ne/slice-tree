import { assertEquals } from "jsr:@std/assert";

import { SliceTree } from "./tree.ts";

const data = await Deno.readTextFile("tmp/bench-data.txt");

function random_string(l = 1): string {
  return Math.random().toString().slice(2, 2 + l);
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
  (b) => {
    const char = random_string();

    b.start();

    const text = new SliceTree();
    text.write(0, char);
    text.write(1, data);

    b.end();
  },
);

Deno.bench(
  "Creating a string",
  {
    group: "Creating",
  },
  (b) => {
    const char = random_string();

    b.start();

    const _text = char + data;

    b.end();
  },
);

Deno.bench(
  "Inserting 1 char into a SliceTree",
  {
    group: "Inserting 1 char",
    baseline: true,
  },
  (b) => {
    const char = random_string();
    const text = new SliceTree();
    text.write(0, char);
    text.write(1, data);

    b.start();

    text.write(1, char);

    b.end();
  },
);

Deno.bench(
  "Inserting 1 char into a string",
  {
    group: "Inserting 1 char",
  },
  (b) => {
    const char = random_string();
    let text = char + data;

    b.start();

    text = text.substring(0, 1) + char + text.substring(1);

    b.end();
  },
);

Deno.bench(
  "Inserting 10 chars into a SliceTree",
  {
    group: "Inserting 10 chars",
    baseline: true,
  },
  (b) => {
    const char = random_string();
    const text = new SliceTree();
    text.write(0, char);
    text.write(1, data);

    b.start();

    for (let i = 1; i <= 10; i += 1) {
      text.write(i * 10, char);
    }

    b.end();
  },
);

Deno.bench(
  "Inserting 10 chars into a string",
  {
    group: "Inserting 10 chars",
  },
  (b) => {
    const char = random_string();
    let text = char + data;

    b.start();

    for (let i = 1; i <= 10; i += 1) {
      text = text.substring(0, i * 10) + char + text.substring(i * 10);
    }

    b.end();
  },
);

Deno.bench(
  "Inserting 100 chars into a SliceTree",
  {
    group: "Inserting 100 chars",
    baseline: true,
  },
  (b) => {
    const char = random_string();
    const text = new SliceTree();
    text.write(0, char);
    text.write(1, data);

    b.start();

    for (let i = 1; i <= 100; i += 1) {
      text.write(i * 10, char);
    }

    b.end();
  },
);

Deno.bench(
  "Inserting 100 chars into a string",
  {
    group: "Inserting 100 chars",
  },
  (b) => {
    const char = random_string();
    let text = char + data;

    b.start();

    for (let i = 1; i <= 100; i += 1) {
      text = text.substring(0, i * 10) + char + text.substring(i * 10);
    }

    b.end();
  },
);

Deno.bench(
  "Removing 1 char from a SliceTree",
  {
    group: "Removing 1 char",
    baseline: true,
  },
  (b) => {
    const char = random_string();
    const text = new SliceTree();
    text.write(0, char);
    text.write(1, data);

    b.start();

    text.erase(1, 1);

    b.end();
  },
);

Deno.bench(
  "Removing 1 char from a string",
  {
    group: "Removing 1 char",
  },
  (b) => {
    const char = random_string();
    let text = char + data;

    b.start();

    text = text.substring(0, 1) + text.substring(2);

    b.end();
  },
);

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

    for (let i = 1; i <= 10; i += 1) {
      text.write(1, char);
      const line = text.line(1).toArray().join("");
      assertEquals(line, "аагаміі\n");
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

    for (let i = 1; i <= 10; i += 1) {
      text = text.substring(0, 1) + char + text.substring(1);
      const line = read_line(text, 1);
      assertEquals(line, "аагаміі\n");
    }

    b.end();
  },
);
