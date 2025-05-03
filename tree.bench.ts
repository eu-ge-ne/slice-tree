import { SliceTree } from "./tree.ts";

const data = await Deno.readTextFile("tmp/be-official.dic");

function random_string(l = 1): string {
  return Math.random().toString().slice(2, 2 + l);
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

    const _ = char + data;

    b.end();
  },
);

// TODO

Deno.bench(
  "Inserting 1 char into a SliceTree",
  { group: "Inserting 1 char", baseline: true },
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
  { group: "Inserting 1 char" },
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
  { group: "Inserting 10 chars", baseline: true },
  (b) => {
    const char = random_string();
    const text = new SliceTree();
    text.write(0, char);
    text.write(1, data);

    b.start();

    for (let i = 0; i < 10; i += 1) {
      text.write(1 + (i * 10), char);
    }

    b.end();
  },
);

Deno.bench(
  "Inserting 10 chars into a string",
  { group: "Inserting 10 chars" },
  (b) => {
    const char = random_string();
    let text = char + data;

    b.start();

    for (let i = 0; i < 10; i += 1) {
      text = text.substring(0, 1 + (i * 10)) + char +
        text.substring(1 + (i * 10));
    }

    b.end();
  },
);

Deno.bench(
  "Inserting 100 chars into a SliceTree",
  { group: "Inserting 100 chars", baseline: true },
  (b) => {
    const char = random_string();
    const text = new SliceTree();
    text.write(0, char);
    text.write(1, data);

    b.start();

    for (let i = 0; i < 100; i += 1) {
      text.write(1 + (i * 10), char);
    }

    b.end();
  },
);

Deno.bench(
  "Inserting 100 chars into a string",
  { group: "Inserting 100 chars" },
  (b) => {
    const char = random_string();
    let text = char + data;

    b.start();

    for (let i = 0; i < 100; i += 1) {
      text = text.substring(0, 1 + (i * 10)) + char +
        text.substring(1 + (i * 10));
    }

    b.end();
  },
);

Deno.bench(
  "Inserting 1000 chars into a SliceTree",
  { group: "Inserting 1000 chars", baseline: true },
  (b) => {
    const char = random_string();
    const text = new SliceTree();
    text.write(0, char);
    text.write(1, data);

    b.start();

    for (let i = 0; i < 1000; i += 1) {
      text.write(1 + (i * 10), char);
    }

    b.end();
  },
);

Deno.bench(
  "Inserting 1000 chars into a string",
  { group: "Inserting 1000 chars" },
  (b) => {
    const char = random_string();
    let text = char + data;

    b.start();

    for (let i = 0; i < 1000; i += 1) {
      text = text.substring(0, 1 + (i * 10)) + char +
        text.substring(1 + (i * 10));
    }

    b.end();
  },
);

Deno.bench(
  "Removing a char from a SliceTree",
  { group: "Removing", baseline: true },
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
  "Removing a char from a string",
  { group: "Removing" },
  (b) => {
    const char = random_string();
    let text = char + data;

    b.start();

    text = text.substring(0, 1) + text.substring(2);

    b.end();
  },
);
