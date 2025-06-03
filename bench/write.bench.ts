import { SliceTree } from "../src/tree.ts";

import { str } from "./utils.ts";

const N = 10 ** 5;

Deno.bench("Appending into a SliceTree", {
  group: "Append",
  baseline: true,
}, (b) => {
  const text = new SliceTree();

  b.start();

  for (let i = 0; i < N; i += 1) {
    text.write(text.count, str(1));
  }

  b.end();
});

Deno.bench("Appending into a string", {
  group: "Append",
}, (b) => {
  let text = "";

  b.start();

  for (let i = 0; i < N; i += 1) {
    text += str(1);
  }

  b.end();
});

Deno.bench("Inserting into a SliceTree", {
  group: "Insert",
  baseline: true,
}, (b) => {
  const text = new SliceTree(str(2));

  b.start();

  for (let i = 0; i < N; i += 1) {
    const pos = Math.trunc(text.count / 2);
    text.write(pos, str(2));
  }

  b.end();
});

Deno.bench("Inserting into a string", {
  group: "Insert",
}, (b) => {
  let text = str(2);

  b.start();

  for (let i = 0; i < N; i += 1) {
    const pos = Math.trunc(text.length / 2);
    text = text.slice(0, pos) + str(2) + text.slice(pos);
  }

  b.end();
});
